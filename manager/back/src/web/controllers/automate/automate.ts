import {BodyParams, Controller, Get, Post,} from "@tsed/common";
import {Name, Required, Returns} from "@tsed/schema";
import {Services} from "../../../core/services";
import {BuildAgentModelAdd, BuildAgentModelReturn, ProductionAgentModel} from "./models";

@Controller("/automate")
@Name("Automation")
export class AutomationController {

    // region get

    @Get("/agent/build")
    @Returns(200, Array).Of(BuildAgentModelReturn)
    async getBuilderAgent() {
        return Services.manager.builder.list()
    }

    @Get("/agent/production")
    @Returns(200, Array).Of(ProductionAgentModel)
    async getProductionAgent() {
        return Services.manager.production.list()
    }

    // endregion

    // region subscribe

    @Post("/agent/production")
    @Returns(204)
    async addProductionAgent(@Required() @BodyParams(ProductionAgentModel) agent: ProductionAgentModel) {
        Services.manager.production.add(agent)
    }

    @Post("/agent/build")
    @Returns(204)
    async addBuildAgent(@Required() @BodyParams(BuildAgentModelAdd) agent: BuildAgentModelAdd) {
        Services.manager.builder.add(agent)
    }

    // endregion

    // region keep-alive

    @Post("/agent/build/keep-alive")
    @Returns(204)
    async builderAgentKeepAlive(@Required() @BodyParams("url", String) url: string) {
        // Services.manager.builder.keepAlive(url)
    }

    @Post("/agent/production/keep-alive")
    @Returns(204)
    async productionAgentKeepAlive(@Required() @BodyParams("url", String) url: string) {
        // Services.manager.production.keepAlive(url)
    }

    // endregion

}
