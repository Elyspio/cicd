import {DeployConfig, Job, ProductionAgent} from "../types";
import {AgentIdentifier, Base} from "./base";
import {Services} from "../../index";
import {DeployConfigModel, ProductionAgentApi} from "../../../apis/agent-prod";
import {ManagerMethods} from "../service";

export class Production extends Base implements ManagerMethods<ProductionAgent> {

    public add(agent: Omit<ProductionAgent, "lastUptime" | "availability">) {
        return super.baseAdd<ProductionAgent>(agent, "production");
    }

    public update(agent: AgentIdentifier<ProductionAgent>, newAgent: Partial<ProductionAgent>) {
        return super.baseUpdate<ProductionAgent>(agent, newAgent, "production");
    }

    public delete(agent: AgentIdentifier<ProductionAgent>,) {
        super.baseDelete<ProductionAgent>(agent, "production");
    }

    public list(): ProductionAgent[] {
        return this.baseList<ProductionAgent>("production");
    }

    public keepAlive(agent: AgentIdentifier<ProductionAgent>): void {
        this.update(agent, {availability: "free", lastUptime: new Date()});
    }

    public askDeploy(config: DeployConfig) {
        const id = super.nextId;
        Services.manager.config.queues.deployments.enqueue({...config, createdAt: new Date(), finishedAt: null, startedAt: null, id})
        Services.manager.saveConfig();
        return id;
    }

    public async deploy(agent: ProductionAgent, config: Job<DeployConfig>) {
        config.startedAt = new Date();
        await super.save();

        if (config.docker != undefined) {
            await new ProductionAgentApi(undefined, agent.uri).productionAgentBuild(config as DeployConfigModel);
            super.finishJob(config.id);

        }

        config.finishedAt = new Date();
        await super.save()

    }

}


