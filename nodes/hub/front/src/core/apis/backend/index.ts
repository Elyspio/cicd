import { injectable } from "inversify";
import { AgentsApi, DockerControllerApi, GithubApi, OperationApi, OperationJobsApi, OperationMappingsApi } from "./generated";
import axios from "axios";

const instance = axios.create({
	withCredentials: true,
});

@injectable()
export class CicdApi {
	public readonly agents = new AgentsApi(undefined, window.config.endpoints.core.api, instance);
	public readonly docker = new DockerControllerApi(undefined, window.config.endpoints.core.api, instance);
	public readonly github = new GithubApi(undefined, window.config.endpoints.core.api, instance);
	public readonly operation = {
		core: new OperationApi(undefined, window.config.endpoints.core.api, instance),
		mappings: new OperationMappingsApi(undefined, window.config.endpoints.core.api, instance),
		jobs: new OperationJobsApi(undefined, window.config.endpoints.core.api, instance),
	};
}
