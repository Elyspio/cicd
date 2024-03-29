import { BodyParams, Controller, Post } from "@tsed/common";
import { Description, Name, Required, Returns } from "@tsed/schema";
import { BuildConfigModel, BuildResult } from "./models";
import { Services } from "../../../core/services";
import { AppProtected } from "../../middleware/protected";

@Controller("/build-agent")
@Name("BuildAgent")
export class AutomationController {
	@Post("/build")
	@Description("Build and push a project following a configuration")
	@AppProtected()
	@(Returns(200, Array).Of(BuildResult))
	async build(@Required() @BodyParams(BuildConfigModel) conf: BuildConfigModel) {
		return Services.agent.build(conf);
	}
}
