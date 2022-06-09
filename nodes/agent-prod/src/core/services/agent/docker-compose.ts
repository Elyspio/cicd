import { $log } from "@tsed/common";
import * as path from "path";
import { BuildResult, DeployConfigModel } from "../../../web/controllers/agent/models";
import { Services } from "../index";
import { DeployAbilityType } from "../../apis/hub";
import { Apis } from "../../apis";
import * as os from "os";
import { hudSocket } from "./socket";

export class DockerComposeService {
	async pull(id: string, { docker }: DeployConfigModel, token: string) {
		return new Promise<BuildResult>(async (resolve, reject) => {
			if (!docker || !docker.compose) {
				reject("Not implemented yet");
				return;
			}

			const folder = path.dirname(docker.compose.path);
			const completedCommand = `${await this.getDockerComposeCommand()} pull`;
			$log.info("DockerComposeService.pull", { completedCommand, folder });
			const { code, stderr, stdout } = await Apis.runner.runFromApp("CICD", { command: completedCommand, cwd: folder }, token).then((x) => x.data);
			await hudSocket.invoke("job-std", id, "Out", stderr);
			resolve({ stdout: stderr, stderr: "", status: code });
		});
	}

	async up(id: string, { docker }: DeployConfigModel, token: string, daemon = true) {
		return new Promise<BuildResult>(async (resolve, reject) => {
			if (!docker || !docker.compose) {
				reject("Not implemented yet");
				return;
			}
			const folder = path.dirname(docker.compose.path);
			const completedCommand = `${await this.getDockerComposeCommand()} up --remove-orphans ${daemon ? "-d" : ""}`;
			const { stdout, stderr, code } = await Apis.runner.runFromApp("CICD", { command: completedCommand, cwd: folder }, token).then((x) => x.data);
			await hudSocket.invoke("job-std", id, "Out", stderr);
			resolve({ stdout: stderr, stderr: "", status: code });
		});
	}

	async down({ docker }: DeployConfigModel, token: string) {
		return new Promise<BuildResult>(async (resolve, reject) => {
			if (!docker || !docker.compose) {
				reject("Not implemented yet");
				return;
			}

			const folder = docker.compose.path;
			const completedCommand = `${await this.getDockerComposeCommand()} down`;
			const { stdout, stderr, code } = await Apis.runner.runFromApp("CICD", { command: completedCommand, cwd: folder }, token).then((x) => x.data);
			resolve({ stdout: stderr, stderr: "", status: code });
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
		return config.abilities.find((ability) => ability.type === DeployAbilityType.DockerCompose)?.dockerCompose!;
	}

	private async getDockerComposeCommand() {
		return (await this.getDockerComposeConfig()).integratedToCLi ? "docker compose" : "docker-compose";
	}
}
