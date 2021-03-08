import {BodyParams, Controller, Post,} from "@tsed/common";
import {Description, Name, Required, Returns} from "@tsed/schema";
import {DeployConfig} from "../../../../../manager/back/src/core/services/manager/types";
import {DeployConfigModel} from "./models";
import {Services} from "../../../core/services";


@Controller("/production-agent")
@Name("ProductionAgent")
export class AutomationController {

    @Post("/deploy")
    @Description("Deploy a project following a configuration")
    @Returns(200, Array).Of(String)
    async build(@Required() @BodyParams(DeployConfigModel) conf: DeployConfig) {
        return Services.agent.deploy(conf);
    }

}
