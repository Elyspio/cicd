import {BuildAgentModelAdd} from "../../apis/hub";
import {Services} from "../index";
import {files} from "../storage";
import {promises} from "fs"
import {BuildConfigModel} from "../../../web/controllers/agent/models";
import {Helper} from "../../utils/helper";
import getIp = Helper.getIp;

const {rm} = promises;


export class BuilderAgentService {

	private buildNum = 1

	async getConfig() {
		const conf = await Services.storage.read<BuildAgentModelAdd>(files.conf);
		conf.uri = `${process.env.OWN_PROTOCOL}://${getIp()}:${process.env.HTTP_PORT}`
		return conf;
	}

	/**
	 * Build a docker image from a repository and a dockerfile config
	 * At the end of the built image is pushed to repository
	 */
	async build(config: BuildConfigModel) {
		const folder = await Services.git.initFolder(config)
		const strs = await Services.docker.buildAndPush(this.buildNum++, config, folder);
		try {
			await rm(folder, {recursive: true, force: true});
		} catch (e) {

		}
		return strs;
	}
}
