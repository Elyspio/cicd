import { inject, injectable } from "inversify";
import { CicdApi } from "../../apis/backend";

@injectable()
export class DockerService {
	@inject(CicdApi)
	private client!: CicdApi;
}
