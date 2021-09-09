import {BuildAgent, BuildConfig, DeployConfig, Job, ProductionAgent} from "./types";
import {BuildAgentApi, DockerConfigModelPlatformsEnum} from "../../apis/agent-build";
import {Services} from "../index";
import {DeployJobModel, ProductionAgentApi} from "../../apis/agent-prod";
import {Log} from "../../utils/decorators/logger";
import {getLogger} from "../../utils/logger";

export class AutomateService {
	private static log = getLogger.service(AutomateService);

	@Log(AutomateService.log)
	public async build(agent: BuildAgent, job: Job<BuildConfig>) {

		const platforms = Array<DockerConfigModelPlatformsEnum>();
		for (const key in DockerConfigModelPlatformsEnum) {
			if (job.config.docker.platforms.some(p => p === DockerConfigModelPlatformsEnum[key])) {
				platforms.push(DockerConfigModelPlatformsEnum[key])
			}
		}

		Services.hub.queues.builds.delete(job);
		job.startedAt = new Date();
		Services.hub.jobs.builds.add(job);

		const {data: stdouts} = await new BuildAgentApi(undefined, agent.uri).buildAgentBuild({
			config: {
				...job.config,
				docker: {
					...job.config.docker,
					platforms
				}
			},
			id: job.id

		});

		job.finishedAt = new Date();
		Services.hub.agents.builder.finishJob(job.id);
		Services.hub.jobs.builds.update(job.id, job)

	}

	@Log(AutomateService.log)
	public async deploy(agent: ProductionAgent, job: Job<DeployConfig>) {

		Services.hub.queues.deployments.delete(job);
		job.startedAt = new Date();
		Services.hub.jobs.deployments.add(job);
		if (job.config.docker != undefined) {
			await new ProductionAgentApi(undefined, agent.uri).productionAgentBuild(job as DeployJobModel);
			Services.hub.agents.production.finishJob(job.id);

		}

		job.finishedAt = new Date();
		Services.hub.jobs.deployments.update(job.id, job)

	}

}
