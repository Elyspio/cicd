import {BodyParams, Controller, Get, Post,} from "@tsed/common";
import {Name, Required, Returns} from "@tsed/schema";
import {Services} from "../../../core/services";
import {BuildConfigModel, DeployConfigModel, HubConfig, MappingModel} from "./model";

const examples: { build: BuildConfigModel } = {
	build: {
		docker: {
			dockerfiles: [{
				path: "Dockerfile",
				wd: ".",
				image: "automatize-github-docker",
				tag: "test"
			}],
			platforms: ["linux/amd64", "linux/arm64"],
			username: "elyspio"
		},
		github: {
			remote: "https://github.com/Elyspio/test.git",
			branch: "master"
		}
	}
}


@Controller("/automate/operation")
@Name("Operation")
export class AutomationController {


	@Post("/register")
	async register(
		@Required() @BodyParams("build", BuildConfigModel) build: BuildConfigModel,
		@Required() @BodyParams("deploy", DeployConfigModel) deploy: DeployConfigModel
	) {
		await Services.hub.registerMapping({build, deploy})
	}


	@Post("/build")
	@Returns(204)
	async start(@Required() @BodyParams(BuildConfigModel) config: BuildConfigModel) {
		await Services.hub.agents.builder.askBuild(config);
	}

	@Post("/deployment")
	@Returns(204)
	async deploy(@Required() @BodyParams(DeployConfigModel) config: DeployConfigModel) {
		await Services.hub.agents.production.askDeploy(config);
	}

	@Get("/mappings")
	@Returns(200, Array).Of(MappingModel)
	getMappings() {
		return Services.hub.config.mappings;
	}

	@Get("/config")
	@Returns(200, HubConfig)
	getConfig() {
		return Services.hub.config;
	}

}
