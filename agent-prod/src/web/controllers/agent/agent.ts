import {BodyParams, Controller, Post,} from "@tsed/common";
import {Description, Name, Required, Returns} from "@tsed/schema";
import {DeployConfig, Job} from "../../../../../manager/back/src/core/services/manager/types";
import {DeployJobModel} from "./models";
import {Services} from "../../../core/services";


@Controller("/production-agent")
@Name("ProductionAgent")
export class AutomationController {

    @Post("/deploy")
    @Description("Deploy a project following a configuration")
    @Returns(200, Array).Of(String)
    async build(@Required() @BodyParams(DeployJobModel) conf: DeployJobModel) {
        return Services.agent.deploy(conf);
    }

}
