import { $log } from "@tsed/common";
import * as path from "path";
import { DeployConfigModel } from "../../../web/controllers/agent/models";
import { Services } from "../index";
import { ProductionAgentModelAddAbilitiesTypeEnum } from "../../apis/hub";
import { Apis } from "../../apis";
import * as os from "os";
import { hudSocket } from "./socket";

export class DockerComposeService {
	async pull(id: string, { docker }: DeployConfigModel, token: string) {
		return new Promise<string>(async (resolve, reject) => {
			if (!docker || !docker.compose) {
				reject("Not implemented yet");
				return;
			}

			const folder = path.dirname(docker.compose.path);
			const completedCommand = `${await this.getDockerComposeCommand()} pull`;
			$log.info("DockerComposeService.pull", { completedCommand, folder });
			const stderr = await Apis.runner.runFromApp("CICD", { command: completedCommand, cwd: folder }).then((x) => x.data.stderr);
			await hudSocket.invoke("job-std", "id", "Out", stderr);
			resolve(stderr);
		});
	}

	async up(id: string, { docker }: DeployConfigModel, token: string, daemon = true) {
		return new Promise<string>(async (resolve, reject) => {
			if (!docker || !docker.compose) {
				reject("Not implemented yet");
				return;
			}
			const folder = path.dirname(docker.compose.path);
			const completedCommand = `${await this.getDockerComposeCommand()} up --remove-orphans ${daemon ? "-d" : ""}`;
			const stderr = await Apis.runner.runFromApp("CICD", { command: completedCommand, cwd: folder }).then((x) => x.data.stderr);
			await hudSocket.invoke("job-std", "id", "Out", stderr);
			resolve(stderr);
		});
	}

	async down({ docker }: DeployConfigModel, token: string) {
		return new Promise<string>(async (resolve, reject) => {
			if (!docker || !docker.compose) {
				reject("Not implemented yet");
				return;
			}

			const folder = docker.compose.path;
			const completedCommand = `${await this.getDockerComposeCommand()} down`;
			const stderr = await Apis.runner.runFromApp("CICD", { command: completedCommand, cwd: folder }).then((x) => x.data.stderr);
			resolve(stderr);
		});
	}

	/**
	 * List all docker-compose.yml files in multiple folders
	 * @param folders
	 * @param token user authorization token
	 */
	async list(folders: string[], token: string) {
		let command;
		if (os.platform() === "win32") {
			command = `where /r ${folders.join(" ")} docker-compose.yml`;
		} else {
			command = `find ${folders.join(" ")} -name docker-compose.yml`;
		}

		const { stdout } = await Apis.runner.run({ cwd: "/", command }, token).then((x) => x.data);
		return stdout
			.split("\n")
			.map((s) => s.trim())
			.filter((s) => s.length);
	}

	private async getDockerComposeConfig() {
		const config = await Services.agent.getConfig();
		return config.abilities.find((ability) => ability.type === ProductionAgentModelAddAbilitiesTypeEnum.DockerCompose)?.dockerCompose!;
	}

	private async getDockerComposeCommand() {
		return (await this.getDockerComposeConfig()).isDockerComposeIntegratedToCli ? "docker compose" : "docker-compose";
	}
}
