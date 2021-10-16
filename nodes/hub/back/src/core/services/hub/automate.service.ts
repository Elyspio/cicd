import { BuildAgent, BuildConfig, DeployAgent, DeployConfig, Job } from "./types";
import { BuildAgentApi, DockerfilesConfigModel, DockerfilesConfigModelPlatformsEnum } from "../../apis/agent-build";
import { DeployJobModel, ProductionAgentApi } from "../../apis/agent-prod";
import { Log } from "../../utils/decorators/logger";
import { getLogger } from "../../utils/logger";
import { Service } from "@tsed/common";
import { AgentBuild } from "./agent/builder";
import { AgentDeployment } from "./agent/production";
import { QueueBuild } from "./queue/build";
import { JobBuild } from "./job/build";
import { QueueProduction } from "./queue/deployment";
import { JobDeployment } from "./job/deployment";

@Service()
export class AutomateService {
	private static log = getLogger.service(AutomateService);
	private services: {
		queues: { builds: QueueBuild; deployments: QueueProduction };
		jobs: { builds: JobBuild; deployments: JobDeployment };
		agents: { builds: AgentBuild; deployments: AgentDeployment };
	};

	constructor(agentBuild: AgentBuild, agentProduction: AgentDeployment, queueBuild: QueueBuild, queueproduction: QueueProduction, jobBuild: JobBuild, jobProduction: JobDeployment) {
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
		};
	}

	@Log(AutomateService.log)
	public async build(agent: BuildAgent, job: Job<BuildConfig>) {
		const platforms = Array<DockerfilesConfigModelPlatformsEnum>();
		for (const key in DockerfilesConfigModelPlatformsEnum) {
			if (job.config.dockerfiles?.platforms.some((p) => p === DockerfilesConfigModelPlatformsEnum[key])) {
				platforms.push(DockerfilesConfigModelPlatformsEnum[key]);
			}
		}

		job.startedAt = new Date();
		await this.services.jobs.builds.add(job);

		const dockerfiles: DockerfilesConfigModel | undefined = job.config.dockerfiles
			? {
					username: job.config.dockerfiles.username,
					files: job.config.dockerfiles.files.map((df) => ({
						image: df.image,
						path: df.path,
						tag: df.tag,
						wd: df.wd,
					})),
					platforms,
			  }
			: undefined;

		try {
			const { data: stdout } = await new BuildAgentApi(undefined, agent.uri).build({
				config: {
					...job.config,
					dockerfiles,
					bake: job.config.bake,
				},
				id: job.id,
			});
			job.stdout = stdout.join("");
		} catch (e) {
			const err = e as Error;
			const error = err.message + "\n" + err.stack;
			job.error = error;
			AutomateService.log.error(error);
		}

		job.finishedAt = new Date();
		this.services.agents.builds.finishJob(job.id);
		await this.services.jobs.builds.update(job.id, job);
	}

	@Log(AutomateService.log)
	public async deploy(agent: DeployAgent, job: Job<DeployConfig>) {
		job.startedAt = new Date();
		await this.services.jobs.deployments.add(job);
		if (job.config.docker != undefined) {
			try {
				const { data: stdout } = await new ProductionAgentApi(undefined, agent.uri).productionAgentBuild(job as DeployJobModel);
				job.stdout = stdout.join("");
			} catch (e) {
				const err = e as Error;
				const error = err.message + "\n" + err.stack;
				job.error = error;
				AutomateService.log.error(error);
			}
			this.services.agents.deployments.finishJob(job.id);
		}

		job.finishedAt = new Date();
		await this.services.jobs.deployments.update(job.id, job);
	}
}
