import {ManagerMethods} from "../service";
import {DeployConfig, ProductionAgent} from "../types";
import {AgentIdentifier, Base} from "./base";
import {Services} from "../../index";

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
        Services.manager.config.queues.deployments.enqueue(config)
    }

    public deploy(agent: AgentIdentifier<ProductionAgent>, config: DeployConfig) {
    }

}


