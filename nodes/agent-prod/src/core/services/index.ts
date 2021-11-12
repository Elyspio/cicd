import { StorageService } from "./storage";
import { DockerComposeService } from "./agent/docker-compose";
import { ProductionAgentService } from "./agent/production";

export const Services = {
	agent: new ProductionAgentService(),
	storage: new StorageService(),
	docker: {
		compose: new DockerComposeService(),
	},
};
