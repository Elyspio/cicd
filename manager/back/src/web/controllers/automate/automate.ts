import {BodyParams, Controller, Get, Post, } from "@tsed/common";
import {Name, Returns} from "@tsed/schema";
import {Services} from "../../../core/services";
import {BuildAgentModelAdd, BuildAgentModelReturn, ProductionAgentModel} from "./models";
@Controller("/automate")
@Name("Automation")
export class AutomationController {

    @Get("/agent/build")
    @Returns(200, Array).Of(BuildAgentModelReturn)
    async getBuilderAgent() {
        return Services.manager.current.agents.builder
    }

    @Post("/agent/build")
    @Returns(204)
    async addBuildAgent(@BodyParams(BuildAgentModelAdd) agent: BuildAgentModelAdd) {
        Services.manager.agents.builder.add(agent)
    }


    @Get("/agent/production")
    @Returns(200, Array).Of(ProductionAgentModel)
    async getProductionAgent() {
        return Services.manager.current.agents.production
    }

    @Post("/agent/production")
    @Returns(204)
    async addProductionAgent(@BodyParams(ProductionAgentModel) agent: ProductionAgentModel) {
        Services.manager.agents.production.add(agent)
    }

}
