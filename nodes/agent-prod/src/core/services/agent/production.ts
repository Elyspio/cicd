import { Services } from "../index";
import { files } from "../storage";
import { DeployJobModel } from "../../../web/controllers/agent/models";
import { ProductionAgentModelAdd } from "../../apis/hub";
import { Helper } from "../../utils/helper";
import getIp = Helper.getIp;

export class ProductionAgentService {
	async getConfig() {
		const conf = await Services.storage.read<ProductionAgentModelAdd>(files.conf);
		conf.uri = `${process.env.OWN_PROTOCOL}://${getIp()}:${process.env.HTTP_PORT}`;
		return conf;
	}

	/**
	 * Deploy a docker-compose configuration
	 */
	async deploy({ config }: DeployJobModel) {
		if (config?.docker?.compose?.path) {
			await Services.docker.compose.pull(config);
			await Services.docker.compose.up(config);
		}
	}
}
