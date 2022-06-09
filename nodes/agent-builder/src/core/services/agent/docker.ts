import * as path from "path";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { hudSocket } from "./socket";
import { BuildConfigModel, BuildResult } from "../../../web/controllers/agent/models";
import { getLogger } from "../../utils/logger";
import { Log } from "../../utils/decorators/logger";

export class DockerService {
	private logger = getLogger.service(DockerService);

	@Log()
	async buildDockerfiles(buildNumber: number, { config: { dockerfiles: conf }, id }: BuildConfigModel, folder: string) {
		const { files, platforms, username } = conf!;

		let command = ["docker"];
		if (platforms.length > 0) {
			command.push("buildx");
		}
		command.push(`build`);
		if (platforms.length > 0) {
			command.push(` --platform ${platforms.join(",")}`);
		}

		return await Promise.all(
			files.map((df) => {
				const dockerfilePath = path.join(folder, df.path);
				return new Promise<BuildResult>((resolve, reject) => {
					const dockerFileDir = path.join(folder, df.wd);
					const completedCommand = `${command.join(" ")} -f ${dockerfilePath}  -t ${username.toLowerCase()}/${df.image.toLowerCase()}:${df.tag?.toLowerCase() ?? "latest"} --push .`;
					this.logger.info(`BuilderAgentService.build.${buildNumber}`, {
						completedCommand,
						dockerFileDir,
						df,
					});
					const splited = completedCommand.split(" ").filter((x) => x.length > 0);
					const process = spawn(splited[0], splited.slice(1), {
						cwd: dockerFileDir,
					});
					this.handleProcess(process, id, completedCommand, resolve);
				});
			}),
		);
	}

	@Log()
	async bake(buildNumber: number, { config: { bake }, id }: BuildConfigModel, folder: string) {
		const bakePath = path.join(folder, bake!.bakeFilePath);

		const command = "docker";
		const args = ["buildx", "bake", "--push"];

		const process = spawn(command, args, { cwd: path.dirname(bakePath) });

		return new Promise<BuildResult>((resolve) => {
			this.handleProcess(process, id, `${command} ${args.join(" ")}`, resolve);
		}).then((str) => [str]);
	}

	private handleProcess(process: ChildProcessWithoutNullStreams, id: string, completedCommand: string, resolve: (std: BuildResult) => void) {
		const std: BuildResult = { stderr: "", status: 0, stdout: "" };
		process.stdout.on("data", (data) => {
			std.stdout += data.toString();
			this.logger.info(`id=${id} stdout: ${data}`);
		});

		process.stderr.on("data", (data) => {
			this.logger.info(`id=${id} stderr: ${data}`);
			std.stderr += data.toString();
			hudSocket.invoke("job-std", id, "Out", data.toString());
		});

		process.on("close", (code) => {
			this.logger.info(`Command: "${completedCommand}" exited with code ${code}`);
			std.status = code!;
			resolve(std);
		});

	}
}

type ResolveRejectProcess = {
	resolve: (value: PromiseLike<string> | string) => void;
	reject: (reason?: any) => void;
};
