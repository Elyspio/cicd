import {BuildAgent, BuildConfig, DeployConfig, Job, ProductionAgent} from "./types";
import {BuildAgentApi, DockerConfigModelPlatformsEnum} from "../../apis/agent-build";
import {Services} from "../index";
import {DeployConfigModel, DeployJobModel, ProductionAgentApi} from "../../apis/agent-prod";

export class AutomateService {

    public async build(agent: BuildAgent, job: Job<BuildConfig>) {

        const platforms = Array<DockerConfigModelPlatformsEnum>();
        for (const key in DockerConfigModelPlatformsEnum) {
            if (job.config.docker.platforms.some(p => p === DockerConfigModelPlatformsEnum[key])) {
                platforms.push(DockerConfigModelPlatformsEnum[key])
            }
        }

        Services.manager.queues.builds.delete(job);
        job.startedAt = new Date();
        Services.manager.jobs.builds.add(job);

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
        Services.manager.agents.builder.finishJob(job.id);
        Services.manager.jobs.builds.update(job.id, job)

    }

    public async deploy(agent: ProductionAgent, job: Job<DeployConfig>) {

        Services.manager.queues.deployments.delete(job);
        job.startedAt = new Date();
        Services.manager.jobs.deployments.add(job);
        if (job.config.docker != undefined) {
            await new ProductionAgentApi(undefined, agent.uri).productionAgentBuild(job as DeployJobModel );
            Services.manager.agents.production.finishJob(job.id);

        }

        job.finishedAt = new Date();
        Services.manager.jobs.deployments.update(job.id, job)

    }

}
