import { BodyParams, Controller, Post } from "@tsed/common";
import { Name, Required, Returns } from "@tsed/schema";
import { GithubPushWebhook } from "./models";
import { AgentBuild } from "../../../core/services/hub/agent/builder";
import { AgentDeployment } from "../../../core/services/hub/agent/production";
import { Mappings } from "../../../core/services/hub/mapping/mappings";
import { globalConf } from "../../../config/global";

@Controller("/github/webhook")
@Name("Github.Webhooks")
export class GithubWebhooks {
	private services: {
		mappings: Mappings;
		builds: AgentBuild;
		deployments: AgentDeployment;
	};

	constructor(agentBuild: AgentBuild, agentProduction: AgentDeployment, mapping: Mappings) {
		this.services = {
			builds: agentBuild,
			deployments: agentProduction,
			mappings: mapping,
		};
	}

	@Post("/push")
	@Returns(204)
	async push(@Required() @BodyParams(GithubPushWebhook) event: GithubPushWebhook) {
		if (event.ref.includes("refs/heads/")) {
			const branch = event.ref.slice(event.ref.lastIndexOf("/") + 1);
			const mappings = await this.services.mappings.list();
			const push = mappings.find(({ build }) => build.github.remote.includes(event.repository.url) && build.github.branch === branch);
			if (push) {
				const idBuild = await this.services.builds.askBuild(push.build, globalConf.appPermanantToken);
				await this.services.builds.waitForJob(idBuild);
				const idProd = await this.services.deployments.askDeploy(push.deploy, globalConf.appPermanantToken);
				await this.services.deployments.waitForJob(idProd);
			}
		}
	}
}
