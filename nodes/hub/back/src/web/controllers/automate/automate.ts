import { BodyParams, Controller, Get, OnReady, Post } from "@tsed/common";
import { Name, Required, Returns } from "@tsed/schema";
import { BuildConfigModel, DeployConfigModel, HubConfig } from "./model";

import { AgentBuild } from "../../../core/services/hub/agent/builder";
import { AgentDeployment } from "../../../core/services/hub/agent/production";
import { ConfigService } from "../../../core/services/hub/config.service";
import { EngineService } from "../../../core/services/hub/engine.service";

@Controller("/automate")
@Name("Automate")
export class AutomationController implements OnReady {
	private services: { deployments: AgentDeployment; engine: EngineService; builds: AgentBuild; config: ConfigService };

	constructor(agentBuild: AgentBuild, agentProduction: AgentDeployment, config: ConfigService, engine: EngineService) {
		this.services = {
			builds: agentBuild,
			deployments: agentProduction,
			config,
			engine,
		};
	}

	$onReady(): void | Promise<any> {
		this.services.engine.watch();
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

	@Get("/config")
	@Returns(200, HubConfig)
	getConfig() {
		return this.services.config.export();
	}
}
