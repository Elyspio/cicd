import {ManagerMethods} from "../service";
import {Agent, BuildAgent, BuildConfig, ProductionAgent} from "../types";
import {AgentIdentifier, Base} from "./base";
import {Services} from "../../index";
import {BuildAgentApi} from "../../../apis/agent-build";


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
        Services.manager.config.queues.builds.enqueue(config)
    }

    public build(agent: BuildAgent, config: BuildConfig) {
        return new BuildAgentApi(undefined, agent.uri).buildAgentGetBuilderAgent(config);
    }


}

