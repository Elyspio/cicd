import { AuthenticationService } from "./authentication";
import { StorageService } from "./storage";
import { DockerComposeService } from "./agent/docker-compose";
import { ProductionAgentService } from "./agent/production";

export const Services = {
	agent: new ProductionAgentService(),
	authentication: new AuthenticationService(),
	storage: new StorageService(),
	docker: {
		compose: new DockerComposeService(),
	},
};
