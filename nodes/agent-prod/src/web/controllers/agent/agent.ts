import { BodyParams, Controller, Post, Req } from "@tsed/common";
import { Description, Name, Required, Returns } from "@tsed/schema";
import { DeployJobModel } from "./models";
import { Services } from "../../../core/services";
import { Protected } from "../../middleware/protected";
import { Request } from "express";

@Controller("/production-agent")
@Name("ProductionAgent")
export class AutomationController {
	@Post("/deploy")
	@Description("Deploy a project following a configuration")
	@(Returns(200, Array).Of(String))
	@Protected()
	async build(@Required() @BodyParams(DeployJobModel) conf: DeployJobModel, @Req() { auth }: Request) {
		return Services.agent.deploy(conf, auth!.token);
	}
}
