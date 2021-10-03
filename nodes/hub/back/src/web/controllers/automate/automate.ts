import { BodyParams, Controller, Get, OnReady, Post } from "@tsed/common";
import { Name, Required, Returns } from "@tsed/schema";
import { BuildAgentModelAdd, BuildAgentModelReturn, ProductionAgentModel, ProductionAgentModelAdd, ProductionApplications } from "./models";
import { AgentAutomateSocket } from "./socket/agent.automate.socket";
import { AgentBuild } from "../../../core/services/hub/agent/builder";
import { AgentProduction } from "../../../core/services/hub/agent/production";
import { EngineService } from "../../../core/services/hub/engine.service";

@Controller("/automate")
@Name("Automation")
export class AutomationController implements OnReady {
	private static socket: AgentAutomateSocket;
	private services: { build: AgentBuild; deployments: AgentProduction; engine: EngineService };

	constructor(socket: AgentAutomateSocket, agentBuild: AgentBuild, agentProduction: AgentProduction, engine: EngineService) {
		AutomationController.socket = socket;
		this.services = {
			build: agentBuild,
			deployments: agentProduction,
			engine,
		};
	}

	$onReady(): void | Promise<any> {
		this.services.engine.watch();
	}

	// region get
	@Get("/agent/build")
	@(Returns(200, Array).Of(BuildAgentModelReturn))
	async getBuilderAgent() {
		return this.services.build.list();
	}

	@Get("/agent/production")
	@(Returns(200, Array).Of(ProductionAgentModel))
	async getProductionAgent() {
		return this.services.deployments.list();
	}

	@Get("/agent/production/node")
	@(Returns(200, Array).Of(ProductionApplications))
	async getProductionApps() {
		return this.services.deployments.getApps();
	}

	// endregion

	// region subscribe

	@Post("/agent/production")
	@Returns(204)
	async addProductionAgent(
		@Required()
		@BodyParams(ProductionAgentModelAdd)
		agent: ProductionAgentModelAdd
	) {
		await this.services.deployments.add(agent);
	}

	@Post("/agent/build")
	@Returns(204)
	async addBuildAgent(@Required() @BodyParams(BuildAgentModelAdd) agent: BuildAgentModelAdd) {
		await this.services.build.add(agent);
	}

	// endregion
}
