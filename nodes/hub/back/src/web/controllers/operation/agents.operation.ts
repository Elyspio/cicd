import { Controller, Get, Req } from "@tsed/common";
import { Name, Returns } from "@tsed/schema";
import { BuildAgentModelReturn, ProductionAgentModel, ProductionApplications } from "./models";
import { AgentAutomateSocket } from "./socket/agent.automate.socket";
import { AgentBuild } from "../../../core/services/hub/agent/builder";
import { AgentDeployment } from "../../../core/services/hub/agent/production";
import { Protected } from "../../middleware/protected";
import { Request } from "express";
import { AuthenticationService } from "../../../core/services/authentication.service";

@Controller("/operations/agents")
@Name("Operation.Agents")
export class AgentsController {
	private static socket: AgentAutomateSocket;
	private services: { build: AgentBuild; deployments: AgentDeployment; authentication: AuthenticationService };

	constructor(socket: AgentAutomateSocket, agentBuild: AgentBuild, agentProduction: AgentDeployment, authentication: AuthenticationService) {
		AgentsController.socket = socket;
		this.services = {
			build: agentBuild,
			deployments: agentProduction,
			authentication,
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
	@Protected()
	@(Returns(200, Array).Of(ProductionApplications))
	async getProductionApps(@Req() { auth }: Request) {
		const appToken = await this.services.authentication.createAppToken(auth!.token);

		const apps = await this.services.deployments.getApps(appToken);

		await this.services.authentication.deleteAppToken(auth!.token, appToken);

		return apps;
	}

	// endregion
}
