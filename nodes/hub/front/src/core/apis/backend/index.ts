import {injectable} from "inversify";
import {AutomationApi, DockerControllerApi, GithubApi} from "./generated"
import axios from "axios";

const instance = axios.create({
	withCredentials: true,
})


@injectable()
export class CicdApi {
	public readonly clients = {
		automation: new AutomationApi(undefined, window.config.endpoints.core.api, instance),
		docker: new DockerControllerApi(undefined, window.config.endpoints.core.api, instance),
		github: new GithubApi(undefined, window.config.endpoints.core.api, instance),
	}
}
