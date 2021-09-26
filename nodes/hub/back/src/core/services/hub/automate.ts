import {BuildAgent, BuildConfig, DeployConfig, Job, ProductionAgent} from "./types";
import {BuildAgentApi, DockerfilesConfigModelPlatformsEnum} from "../../apis/agent-build";
import {Services} from "../index";
import {DeployJobModel, ProductionAgentApi} from "../../apis/agent-prod";
import {Log} from "../../utils/decorators/logger";
import {getLogger} from "../../utils/logger";

export class AutomateService {
	private static log = getLogger.service(AutomateService);

	@Log(AutomateService.log)
	public async build(agent: BuildAgent, job: Job<BuildConfig>) {

		const platforms = Array<DockerfilesConfigModelPlatformsEnum>();
		for (const key in DockerfilesConfigModelPlatformsEnum) {
			if (job.config.dockerfiles?.platforms.some(p => p === DockerfilesConfigModelPlatformsEnum[key])) {
				platforms.push(DockerfilesConfigModelPlatformsEnum[key])
			}
		}

		Services.hub.queues.builds.delete(job);
		job.startedAt = new Date();
		Services.hub.jobs.builds.add(job);


		const dockerfiles = job.config.dockerfiles ? {
			username: job.config.dockerfiles.username,
			dockerfiles: job.config.dockerfiles.files.map(df => ({image: df.image, path: df.path, tag: df.tag, wd: df.wd})),
			platforms
		} : undefined;

		const {data: stdouts} = await new BuildAgentApi(undefined, agent.uri).buildAgentBuild({
			config: {
				...job.config,
				dockerfiles
			}, id: job.id

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
