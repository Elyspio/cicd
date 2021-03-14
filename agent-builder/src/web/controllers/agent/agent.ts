import {BodyParams, Controller, Post,} from "@tsed/common";
import {Description, Name, Required, Returns} from "@tsed/schema";
import {BuildConfigModel} from "./models";
import {Services} from "../../../core/services";


@Controller("/build-agent")
@Name("BuildAgent")
export class AutomationController {

    @Post("/build")
    @Description("Build and push a project following a configuration")
    @Returns(200, Array).Of(String)
    async build(@Required() @BodyParams(BuildConfigModel) conf: BuildConfigModel) {
        return Services.agent.build(conf);
    }

}
