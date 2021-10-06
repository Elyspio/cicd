import { HubConfigExport } from "./types";
import { getLogger } from "../../utils/logger";
import { OnReady, Service } from "@tsed/common";
import { AgentBuild } from "./agent/builder";
import { AgentProduction } from "./agent/production";
import { QueueBuild } from "./queue/build";
import { JobBuild } from "./job/build";
import { QueueProduction } from "./queue/deployment";
import { JobDeployment } from "./job/deployment";
import { Mappings } from "./mapping/mappings";
import { Log } from "../../utils/decorators/logger";
import { EventManager } from "../../utils/events";

@Service()
export class ConfigService extends EventManager<{ update: (config: HubConfigExport) => void }> implements OnReady {
	private static log = getLogger.service(ConfigService);
	private services: {
		queues: { builds: QueueBuild; deployments: QueueProduction };
		jobs: { builds: JobBuild; deployments: JobDeployment };
		agents: { builds: AgentBuild; deployments: AgentProduction };
		mapping: Mappings;
	};
	private ready: boolean;

	constructor(
		agentBuild: AgentBuild,
		agentProduction: AgentProduction,
		queueBuild: QueueBuild,
		queueproduction: QueueProduction,
		jobBuild: JobBuild,
		jobProduction: JobDeployment,
		mapping: Mappings
	) {
		super();
		this.services = {
			agents: {
				builds: agentBuild,
				deployments: agentProduction,
			},
			queues: {
				builds: queueBuild,
				deployments: queueproduction,
			},
			jobs: {
				builds: jobBuild,
				deployments: jobProduction,
			},
			mapping,
		};
	}

	$onReady(): void | Promise<any> {
		this.ready = true;
	}

	@Log(ConfigService.log)
	public async export(): Promise<HubConfigExport> {
		const func = async () => {
			const [agentB, agentD, queueB, queueD, jobB, jobD, mappings] = await Promise.all([
				this.services.agents.builds.list(),
				this.services.agents.deployments.list(),
				this.services.queues.builds.list(),
				this.services.queues.deployments.list(),
				this.services.jobs.builds.list(),
				this.services.jobs.deployments.list(),
				this.services.mapping.list(),
			]);

			return {
				queues: {
					builds: queueB,
					deployments: queueD,
				},
				mappings,
				jobs: {
					builds: jobB,
					deployments: jobD,
				},
				agents: {
					builds: agentB,
					deployments: agentD,
				},
			};
		};

		return new Promise<HubConfigExport>((resolve) => {
			const resolver = () => {
				if (!this.ready) {
					setTimeout(() => resolver(), 500);
				} else {
					resolve(func());
				}
			};
			resolver();
		});
	}
}
