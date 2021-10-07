import { Controller, Get } from "@tsed/common";
import { Name, Returns } from "@tsed/schema";
import { BuildAgentModelReturn, ProductionAgentModel, ProductionApplications } from "./models";
import { AgentAutomateSocket } from "./socket/agent.automate.socket";
import { AgentBuild } from "../../../core/services/hub/agent/builder";
import { AgentDeployment } from "../../../core/services/hub/agent/production";

@Controller("/operations/agents")
@Name("Operation.Agents")
export class AgentsController {
	private static socket: AgentAutomateSocket;
	private services: { build: AgentBuild; deployments: AgentDeployment };

	constructor(socket: AgentAutomateSocket, agentBuild: AgentBuild, agentProduction: AgentDeployment) {
		AgentsController.socket = socket;
		this.services = {
			build: agentBuild,
			deployments: agentProduction,
		};
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
}
