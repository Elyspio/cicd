import {BuildAgent, BuildConfig, Job} from "../types";
import {AgentIdentifier, Base} from "./base";
import {Services} from "../../index";
import {BuildAgentApi, DockerConfigModelPlatformsEnum} from "../../../apis/agent-build";
import {ManagerMethods} from "../service";


export class Builder extends Base implements ManagerMethods<BuildAgent> {

    public add(agent: Omit<BuildAgent, "lastUptime" | "availability">) {
        return super.baseAdd<BuildAgent>(agent, "builder");
    }

    public update(agent: AgentIdentifier<BuildAgent>, newAgent: Partial<BuildAgent>) {
        return super.baseUpdate<BuildAgent>(agent, newAgent, "builder");
    }

    public delete(agent: AgentIdentifier<BuildAgent>,) {
        super.baseDelete<BuildAgent>(agent, "builder");
    }

    public list(): BuildAgent[] {
        return this.baseList<BuildAgent>("builder");
    }

    public keepAlive(agent: AgentIdentifier<BuildAgent>): void {
        this.update(agent, {availability: "free", lastUptime: new Date()});
    }

    public askBuild(config: BuildConfig) {
        const id = super.nextId;
        Services.manager.config.queues.builds.enqueue({...config, createdAt: new Date(), finishedAt: null, startedAt: null, id})
        super.save();
        return id;
    }

    public async build(agent: BuildAgent, config: Job<BuildConfig>) {

        const platforms = Array<DockerConfigModelPlatformsEnum>();
        for (const key in DockerConfigModelPlatformsEnum) {
            if (config.docker.platforms.some(p => p === DockerConfigModelPlatformsEnum[key])) {
                platforms.push(DockerConfigModelPlatformsEnum[key])
            }
        }

        config.startedAt = new Date();
        super.save();

        const {data: stdouts} = await new BuildAgentApi(undefined, agent.uri).buildAgentBuild({
            ...config, docker: {
                ...config.docker,
                platforms
            }
        });

        super.finishJob(config.id);


    }


}

