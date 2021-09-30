import { injectable } from "inversify";
import { AutomationApi, DockerControllerApi, GithubApi, OperationApi } from "./generated";
import axios from "axios";

const instance = axios.create({
	withCredentials: true,
});

@injectable()
export class CicdApi {
	public readonly automation = new AutomationApi(
		undefined,
		window.config.endpoints.core.api,
		instance,
	);
	public readonly docker = new DockerControllerApi(
		undefined,
		window.config.endpoints.core.api,
		instance,
	);
	public readonly github = new GithubApi(
		undefined,
		window.config.endpoints.core.api,
		instance,
	);
	public readonly operation = new OperationApi(
		undefined,
		window.config.endpoints.core.api,
		instance,
	);
}
