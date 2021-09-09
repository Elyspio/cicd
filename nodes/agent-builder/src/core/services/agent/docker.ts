import * as path from "path";
import {$log} from "@tsed/common";
import {spawn} from "child_process";
import {hudSocket} from "./socket";
import {BuildConfigModel} from "../../../web/controllers/agent/models";

export class DockerService {
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
					const completedCommand = `${command.join(" ")} -f ${dockerfilePath} ${df.wd} -t ${docker.username}/${df.image}:${df.tag ?? "latest"} --push`;
					$log.info(`BuilderAgentService.build.${buildNumber}`, {completedCommand, df})
					const splited = completedCommand.split(" ").filter(x => x.length > 0)
					const process = spawn(splited[0], splited.slice(1));
					let stderr = "";
					process.stdout.on('data', (data) => {
						console.log(`stdout: ${data}`);
					});

					process.stderr.on('data', (data) => {
						console.error(`stderr: ${data}`);
						stderr += data.toString()
						hudSocket.emit("jobs-stdout", id, data.toString())

					});

					process.on('close', (code) => {
						$log.info(`Command: "${completedCommand}" exited with code ${code}`);
						resolve(stderr);
					});

					process.on("error", err => {
						if (err) reject({err, stderr})
					})
				})
			})
		)
	}
}
