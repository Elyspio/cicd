import { BuilderAgentService } from "./agent/builder";
import { AuthenticationService } from "./authentication";
import { StorageService } from "./storage";
import { GitService } from "./agent/git";
import { DockerService } from "./agent/docker";

export const Services = {
	agent: new BuilderAgentService(),
	authentication: new AuthenticationService(),
	storage: new StorageService(),
	git: new GitService(),
	docker: new DockerService(),
};
