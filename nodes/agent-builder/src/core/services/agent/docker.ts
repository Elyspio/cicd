import * as path from "path";
import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { hudSocket } from "./socket";
import { BuildConfigModel } from "../../../web/controllers/agent/models";
import { getLogger } from "../../utils/logger";
import { Log } from "../../utils/decorators/logger";

export class DockerService {
	private static log = getLogger.service(DockerService);

	@Log(DockerService.log)
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
				return new Promise<string>((resolve, reject) => {
					const dockerFileDir = path.resolve(path.join(folder, df.wd));
					const completedCommand = `${command.join(" ")} -f ${dockerfilePath} ${dockerFileDir} -t ${username.toLowerCase()}/${df.image.toLowerCase()}:${
						df.tag?.toLowerCase() ?? "latest"
					} --push`;
					DockerService.log.info(`BuilderAgentService.build.${buildNumber}`, {
						completedCommand,
						df,
					});
					const splited = completedCommand.split(" ").filter((x) => x.length > 0);
					const process = spawn(splited[0], splited.slice(1), {
						cwd: dockerFileDir,
					});
					this.handleProcess(process, id, completedCommand, {
						reject,
						resolve,
					});
				});
			})
		);
	}

	@Log(DockerService.log)
	async bake(buildNumber: number, { config: { bake }, id }: BuildConfigModel, folder: string) {
		const bakePath = path.join(folder, bake!.bakeFilePath);

		const command = "docker";
		const args = ["buildx", "bake", "--push"];

		const process = spawn(command, args, { cwd: path.dirname(bakePath) });

		return new Promise<string>((resolve, reject) => {
			this.handleProcess(process, id, `${command} ${args.join(" ")}`, {
				reject,
				resolve,
			});
		});
	}

	private handleProcess(process: ChildProcessWithoutNullStreams, id: number, completedCommand: string, { reject, resolve }: ResolveRejectProcess) {
		let str = "";
		process.stdout.on("data", (data) => {
			DockerService.log.info(`id=${id} stdout: ${data}`);
		});

		process.stderr.on("data", (data) => {
			DockerService.log.info(`id=${id} stderr: ${data}`);
			str += data.toString();
			hudSocket.emit("jobs-stdout", "build", id, data.toString());
		});

		process.on("close", (code) => {
			DockerService.log.info(`Command: "${completedCommand}" exited with code ${code}`);
			if (code !== 0) reject(str);
			else resolve(str);
		});

		process.on("error", (err) => {
			if (err) reject({ err, stderr: str });
		});
	}
}

type ResolveRejectProcess = {
	resolve: (value: PromiseLike<string> | string) => void;
	reject: (reason?: any) => void;
};
