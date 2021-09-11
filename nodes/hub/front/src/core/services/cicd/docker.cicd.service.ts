import {inject, injectable} from "inversify";
import {DiKeysApi} from "../../di/di.keys.api";
import {CicdApi} from "../../apis/backend";

@injectable()
export class DockerService {
	@inject(DiKeysApi.cicd)
	private client!: CicdApi
}
