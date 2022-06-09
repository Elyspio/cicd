import { BuilderAgentService } from "./agent/builder";
import { StorageService } from "./storage";
import { GitService } from "./agent/git";
import { DockerService } from "./agent/docker";

export const Services = {
	agent: new BuilderAgentService(),
	storage: new StorageService(),
	git: new GitService(),
	docker: new DockerService(),
};
