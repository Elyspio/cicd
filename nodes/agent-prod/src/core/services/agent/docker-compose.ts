import { $log } from "@tsed/common";
import { exec } from "child_process";
import * as path from "path";
import { DeployConfigModel } from "../../../web/controllers/agent/models";
import { Helper } from "../../utils/helper";
import { Auth } from "../authentication";
import { Services } from "../index";
import { ProductionAgentModelAddAbilitiesTypeEnum } from "../../apis/hub";

export class DockerComposeService {
	async pull({ docker }: DeployConfigModel) {
		return new Promise<string>(async (resolve, reject) => {
			if (!docker || !docker.compose) {
				reject("Not implemented yet");
				return;
			}

			const folder = docker.compose.path;

			const completedCommand = `${await this.getDockerComposeCommand()} pull`;
			$log.info("DockerComposeService.pull", { completedCommand, folder });
			exec(completedCommand, { cwd: path.dirname(folder) }, (error, stdout, stderr) => {
				$log.info("DockerComposeService.pull", {
					completedCommand,
					folder,
					error,
					stderr,
				});
				if (error) reject({ error, stderr });
				else resolve(stderr);
			});
		});
	}

	async up({ docker }: DeployConfigModel, daemon = true) {
		return new Promise<string>(async (resolve, reject) => {
			if (!docker || !docker.compose) {
				reject("Not implemented yet");
				return;
			}

			const folder = docker.compose.path;

			const completedCommand = `${await this.getDockerComposeCommand()} up --remove-orphans ${daemon ? "-d" : ""}`;
			exec(completedCommand, { cwd: path.dirname(folder) }, (error, stdout, stderr) => {
				$log.info("DockerComposeService.up", {
					completedCommand,
					folder,
					error,
					stderr,
				});
				if (error) reject({ error, stderr });
				else resolve(stderr);
			});
		});
	}

	async down({ docker }: DeployConfigModel) {
		return new Promise<string>(async (resolve, reject) => {
			if (!docker || !docker.compose) {
				reject("Not implemented yet");
				return;
			}

			const folder = docker.compose.path;

			const completedCommand = `${await this.getDockerComposeCommand()} down`;
			exec(completedCommand, { cwd: path.dirname(folder) }, (error, stdout, stderr) => {
				$log.info("DockerComposeService.down", {
					completedCommand,
					folder,
					error,
					stderr,
				});
				if (error) reject({ error, stderr });
				else resolve(stderr);
			});
		});
	}

	/**
	 * List all docker-compose.yml files in folders
	 * @param folders
	 * @param auth
	 */
	async list(folders: string[], auth?: Auth) {
		// if (!isDev()) {
		// 	const commandRunnerIp = process.env.RUNNER_HOST
		// 	if (commandRunnerIp === undefined) throw "process.env.RUNNER_HOST is not defined aborting"
		// 	if (auth === undefined) throw new Unauthorized("You must be logged to use this service")
		// 	const app = axios.create({
		// 		headers: {
		// 			[authorization_cookie_token]: auth.token
		// 		}
		// 	})
		// 	const {data} = await new RunnerApi(undefined, commandRunnerIp, app).runnerRun({
		// 		cwd: "/",
		// 		command: `find ${folders.join(" ")} -name docker-compose.yml`
		// 	}, {})
		// 	return data.stdout.split("\n")
		// } else {
		// folders = folders.map(f => path.resolve(path.join(__dirname, "..", "..", "..", ".."), f))
		const files = await Promise.all(folders.map(Helper.getFiles));
		return files.flat().filter((f) => f.endsWith("docker-compose.yml"));
		// }
	}

	private async getDockerComposeConfig() {
		const config = await Services.agent.getConfig();
		return config.abilities.find((ability) => ability.type === ProductionAgentModelAddAbilitiesTypeEnum.DockerCompose)?.dockerCompose!;
	}

	private async getDockerComposeCommand() {
		return (await this.getDockerComposeConfig()).isDockerComposeIntegratedToCli ? "docker compose" : "docker-compose";
	}
}
