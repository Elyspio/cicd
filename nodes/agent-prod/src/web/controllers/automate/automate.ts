import { Controller, Get, Req } from "@tsed/common";
import { Description, Name, Returns } from "@tsed/schema";
import { Services } from "../../../core/services";
import { files } from "../../../core/services/storage";
import { AgentDeploy } from "../../../core/apis/hub";
import { Request } from "express";
import { Protected } from "../../middleware/protected";

@Controller("/automate")
@Name("Automate")
export class AutomationController {
	@Get("/node")
	@Description("Fetch the list of docker-compose.yml files")
	@Protected()
	@(Returns(200, Array).Of(String))
	async getApps(@Req() request: Request) {
		const conf = await Services.storage.read<Pick<AgentDeploy, "url" | "folders" | "abilities">>(files.conf);

		return Services.docker.compose.list(conf.folders.apps, request.auth!.token);
	}
}
