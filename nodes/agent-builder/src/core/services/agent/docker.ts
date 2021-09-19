import * as path from "path";
import {spawn} from "child_process";
import {hudSocket} from "./socket";
import {BuildConfigModel} from "../../../web/controllers/agent/models";
import {getLogger} from "../../utils/logger";
import {Log} from "../../utils/decorators/logger";

export class DockerService {

	private static log = getLogger.service(DockerService)

	@Log(DockerService.log)
	async buildAndPush(buildNumber: number, {config: {docker}, id}: BuildConfigModel, folder: string) {
		let command = ["docker"];
		if (docker.platforms.length > 0) {
			command.push("buildx")
		}
		command.push(`build`)
		if (docker.platforms.length > 0) {
			command.push(` --platform ${docker.platforms.join(",")}`)
		}


		return Promise.all(
			docker.dockerfiles.map(df => {
				const dockerfilePath = path.join(folder, df.path)
				return new Promise<string>((resolve, reject) => {
					const dockerFileDir = path.resolve(folder, df.wd);
					const completedCommand = `${command.join(" ")} -f ${dockerfilePath} ${dockerFileDir} -t ${docker.username}/${df.image}:${df.tag ?? "latest"} --push`;
					DockerService.log.info(`BuilderAgentService.build.${buildNumber}`, {completedCommand, df})
					const splited = completedCommand.split(" ").filter(x => x.length > 0)
					const process = spawn(splited[0], splited.slice(1), {
						cwd: dockerFileDir
					});
					let stderr = "";
					process.stdout.on('data', (data) => {
						DockerService.log.info(`id=${id} stdout: ${data}`);
					});

					process.stderr.on('data', (data) => {
						DockerService.log.info(`id=${id} stderr: ${data}`);
						stderr += data.toString()
						hudSocket.emit("jobs-stdout", id, data.toString())

					});

					process.on('close', (code) => {
						DockerService.log.info(`Command: "${completedCommand}" exited with code ${code}`);
						if (code !== 0) reject(stderr);
						else resolve(stderr);
					});

					process.on("error", err => {
						if (err) reject({err, stderr})
					})
				})
			})
		)
	}
}
