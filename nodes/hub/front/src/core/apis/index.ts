import {AuthenticationApi} from "./authentification";
import {AutomationApi, DockerControllerApi, GithubApi} from "./back";


const backend = window.config.endpoints.core.api;

const authentication = window.config.endpoints.authentication.api


export const Apis = {
	core: {
		docker: new DockerControllerApi(undefined, backend),
		github: new GithubApi(undefined, backend),
		automate: new AutomationApi(undefined, backend)
	},
	authentication: {
		login: new AuthenticationApi(undefined, authentication),
	}
}

export function removeTrallingSlash(uri) {
	if (uri[uri.length - 1] === "/") uri = uri.slice(0, -1)
	return uri;
}
