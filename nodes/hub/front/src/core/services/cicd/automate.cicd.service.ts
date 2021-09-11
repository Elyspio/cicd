import {inject, injectable} from "inversify";
import {DiKeysApi} from "../../di/di.keys.api";
import {CicdApi} from "../../apis/backend";

@injectable()
export class AutomateService {
	@inject(DiKeysApi.cicd)
	private client!: CicdApi


	async getProductionApps() {
		return this.client.clients.automation.getProductionApps().then(x => x.data);
	}

}
