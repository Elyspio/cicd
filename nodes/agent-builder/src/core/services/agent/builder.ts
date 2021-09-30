import { BuildAgentModelAdd, BuildAgentModelAddAbilitiesEnum } from "../../apis/hub";
import { Services } from "../index";
import { files } from "../storage";
import { promises } from "fs";
import { BuildConfigModel } from "../../../web/controllers/agent/models";
import { Helper } from "../../utils/helper";
import getIp = Helper.getIp;

const { rm } = promises;

export class BuilderAgentService {
	private buildNum = 1;

	async getConfig() {
		const conf = await Services.storage.read<BuildAgentModelAdd>(files.conf);
		conf.uri = `${process.env.OWN_PROTOCOL}://${getIp()}:${process.env.HTTP_PORT}`;
		return conf;
	}

	/**
	 * Build a docker image from a repository and a dockerfile config
	 * At the end of the built image is pushed to repository
	 */
	async build(config: BuildConfigModel) {
		const { abilities } = await this.getConfig();

		if (!abilities.includes(BuildAgentModelAddAbilitiesEnum.DockerBuildx)) throw new Error("This build is not able to use docker buildx");

		const folder = await Services.git.initFolder(config);
		let strs;

		if (config.config.dockerfiles && config.config.bake) throw new Error("Properties bake and dockerfiles must not be used together");

		if (config.config.dockerfiles) {
			strs = await Services.docker.buildDockerfiles(this.buildNum++, config, folder);
		} else if (config.config.bake) {
			strs = await Services.docker.bake(this.buildNum++, config, folder);
		} else throw new Error("Missing property bake or dockerfiles in build configuration");

		try {
			await rm(folder, { recursive: true, force: true });
		} catch (e) {}
		return strs;
	}
}
