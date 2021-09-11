import {AuthenticationService} from "./authentication.service";
import {StorageService} from "./storage";
import {DockerService} from "./docker/docker";
import {HubService} from "./hub/service";
import {GithubService} from "./github/github";
import {GitService} from "./github/git";

export const Services = {
	authentication: new AuthenticationService(),
	storage: new StorageService(),
	hub: new HubService(),
	docker: new DockerService(),
	github: {
		remote: new GithubService(),
		local: new GitService()
	}
}
