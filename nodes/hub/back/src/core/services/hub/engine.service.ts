import { Service } from "@tsed/common";
import { Log } from "../../utils/decorators/logger";
import { getLogger } from "../../utils/logger";

import { AgentBuild } from "./agent/builder";
import { AgentProduction } from "./agent/production";
import { QueueBuild } from "./queue/build";
import { QueueProduction } from "./queue/deployment";
import { AutomateService } from "./automate.service";

@Service()
export class EngineService {
	private static log = getLogger.service(EngineService);
	private agents: { deployments: AgentProduction; builds: AgentBuild };
	private automate: AutomateService;
	private queues: { deployments: QueueProduction; builds: QueueBuild };

	constructor(agentBuilder: AgentBuild, agentProduction: AgentProduction, queueBuildService: QueueBuild, queueDeployService: QueueProduction, automateService: AutomateService) {
		this.agents = {
			builds: agentBuilder,
			deployments: agentProduction,
		};
		this.queues = {
			builds: queueBuildService,
			deployments: queueDeployService,
		};
		this.automate = automateService;
	}

	@Log(EngineService.log)
	public watch() {
		setInterval(async () => {
			const agents = {
				builds: await this.agents.builds.list(),
			};

			for (const agent of agents.builds.filter((a) => a.availability === "free")) {
				// setImmediate(async () => {
				const job = await this.queues.builds.dequeue();
				if (job) {
					await this.agents.builds.update(agent.uri, { availability: "running" });
					await this.automate.build(agent, job);
					await this.agents.builds.update(agent.uri, { availability: "free" });
				}
				// });
			}
		}, 1000);

		setInterval(async () => {
			const agents = {
				deployments: await this.agents.deployments.list(),
			};

			for (const agent of agents.deployments.filter((a) => a.availability === "free")) {
				const job = await this.queues.deployments.dequeue();
				if (job) {
					await this.agents.deployments.update(agent.uri, { availability: "running" });
					await this.automate.deploy(agent, job);
					await this.agents.deployments.update(agent.uri, { availability: "free" });
				}
			}
		}, 1000);
	}
}
