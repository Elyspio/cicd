import { BodyParams, Controller, Get, Post } from "@tsed/common";
import { Name, Required, Returns } from "@tsed/schema";
import { Services } from "../../../core/services";
import { BuildAgentModelAdd, BuildAgentModelReturn, ProductionAgentModel, ProductionAgentModelAdd, ProductionApplications } from "./models";
import { AgentAutomateSocket } from "./socket/agent.automate.socket";

@Controller("/automate")
@Name("Automation")
export class AutomationController {

	private static socket: AgentAutomateSocket;

	constructor(socket: AgentAutomateSocket) {
		AutomationController.socket = socket;
	}

	// region get
	@Get("/agent/build")
	@Returns(200, Array).Of(BuildAgentModelReturn)
	async getBuilderAgent() {
		return Services.hub.agents.builder.list();
	}

	@Get("/agent/production")
	@Returns(200, Array).Of(ProductionAgentModel)
	async getProductionAgent() {
		return Services.hub.agents.production.list();
	}

	@Get("/agent/production/node")
	@Returns(200, Array).Of(ProductionApplications)
	async getProductionApps() {
		return Services.hub.agents.production.getApps();
	}

	// endregion

	// region subscribe

	@Post("/agent/production")
	@Returns(204)
	async addProductionAgent(@Required() @BodyParams(ProductionAgentModelAdd) agent: ProductionAgentModelAdd) {
		Services.hub.agents.production.add(agent);
	}

	@Post("/agent/build")
	@Returns(204)
	async addBuildAgent(@Required() @BodyParams(BuildAgentModelAdd) agent: BuildAgentModelAdd) {
		Services.hub.agents.builder.add(agent);
	}

	// endregion

	// region keep-alive

	@Post("/agent/build/keep-alive")
	@Returns(204)
	async builderAgentKeepAlive(@Required() @BodyParams("url", String) url: string) {
		Services.hub.agents.builder.keepAlive(url);
	}

	@Post("/agent/production/keep-alive")
	@Returns(204)
	async productionAgentKeepAlive(@Required() @BodyParams("url", String) url: string) {
		Services.hub.agents.production.keepAlive(url);
	}

	// endregion

}
