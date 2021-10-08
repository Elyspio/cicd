import { injectable } from "inversify";
import { AutomateApi, DockerApi, GithubUsersApi, OperationAgentsApi, OperationJobsApi, OperationMappingsApi } from "./generated";
import axios from "axios";
import { BaseAPI } from "./generated/base";

const instance = axios.create({
	withCredentials: true,
});

export type Newable<T> = { new (...args: ConstructorParameters<typeof BaseAPI>): T };

function createApi<T extends BaseAPI>(cls: Newable<T>): T {
	return new cls(undefined, window.config.endpoints.core.api, instance);
}

@injectable()
export class CicdApi {
	public readonly agents = createApi(OperationAgentsApi);
	public readonly docker = createApi(DockerApi);
	public readonly github = createApi(GithubUsersApi);
	public readonly automate = createApi(AutomateApi);
	public readonly operation = {
		mappings: createApi(OperationMappingsApi),
		jobs: createApi(OperationJobsApi),
	};
}
