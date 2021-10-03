import { BodyParams, Controller, Delete, Get, PathParams, Post } from "@tsed/common";
import { Name, Required, Returns } from "@tsed/schema";
import { BuildConfigModel, DeployConfigModel, HubConfig, MappingModel } from "./model";

import { AgentBuild } from "../../../core/services/hub/agent/builder";
import { AgentProduction } from "../../../core/services/hub/agent/production";
import { Mappings } from "../../../core/services/hub/mapping/mappings";
import { ConfigService } from "../../../core/services/hub/config.service";

@Controller("/automate/operation")
@Name("Operation")
export class AutomationController {
	private services: {
		mappings: Mappings;
		builds: AgentBuild;
		deployments: AgentProduction;
		config: ConfigService;
	};

	constructor(agentBuild: AgentBuild, agentProduction: AgentProduction, mappings: Mappings, config: ConfigService) {
		this.services = {
			builds: agentBuild,
			deployments: agentProduction,
			mappings,
			config,
		};
	}

	@Post("/build")
	@Returns(204)
	async start(@Required() @BodyParams(BuildConfigModel) config: BuildConfigModel) {
		await this.services.builds.askBuild(config);
	}

	@Post("/deployment")
	@Returns(204)
	async deploy(@Required() @BodyParams(DeployConfigModel) config: DeployConfigModel) {
		await this.services.deployments.askDeploy(config);
	}

	@Post("/mappings")
	async addMapping(
		@Required() @BodyParams("build", BuildConfigModel) build: BuildConfigModel,
		@Required()
		@BodyParams("deploy", DeployConfigModel)
		deploy: DeployConfigModel
	) {
		await this.services.mappings.add({ build, deploy });
	}

	@Get("/mappings")
	@(Returns(200, Array).Of(MappingModel))
	getMappings() {
		return this.services.mappings.list();
	}

	@Delete("/mappings/:id")
	@Returns(204)
	deleteMappings(@PathParams("id", Number) id: MappingModel["id"]) {
		return this.services.mappings.delete(id);
	}

	@Get("/config")
	@Returns(200, HubConfig)
	getConfig() {
		return this.services.config.export();
	}
}
