import {$log, Controller, Get, Req,} from "@tsed/common";
import {Description, Name, Returns} from "@tsed/schema";
import {Services} from "../../../core/services";
import {files} from "../../../core/services/storage";
import {ProductionAgentModelAdd} from "../../../core/apis/hub";
import {Request} from "express";
import {authorization_cookie_token} from "../../../config/authentication";


@Controller("/automate")
@Name("Automate")
export class AutomationController {

	@Get("/node")
	@Description("Fetch the list of docker-compose.yml files")
	@Returns(200, Array).Of(String)
	async getApps(@Req() request: Request) {
		const {cookies, headers} = request;
		const conf = await Services.storage.read<ProductionAgentModelAdd>(files.conf)

		const cookieAuth = cookies[authorization_cookie_token]
		const headerToken = headers[authorization_cookie_token];

		const token = headerToken ?? cookieAuth;

		return Services.docker.compose.list(conf.folders.apps, token ? {token} : undefined)
	}

}
