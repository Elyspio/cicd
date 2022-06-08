import { Services } from "../index";
import { files } from "../storage";
import { DeployJobModel } from "../../../web/controllers/agent/models";
import { ProductionAgentModelAdd } from "../../apis/hub";
import { Helper } from "../../utils/helper";
import getIp = Helper.getIp;

export class ProductionAgentService {
	async getConfig() {
		const conf = await Services.storage.read<ProductionAgentModelAdd>(files.conf);
		conf.url = `${process.env.OWN_PROTOCOL}://${getIp()}:${process.env.HTTP_PORT}`;
		return conf;
	}

	/**
	 * Deploy a docker-compose configuration
	 */
	async deploy({ config, id }: DeployJobModel, token: string) {
		const strs: string[] = [];
		if (config?.docker?.compose?.path) {
			strs.push(await Services.docker.compose.pull(id, config, token));
			strs.push(await Services.docker.compose.up(id, config, token));
		}
		return strs;
	}
}
