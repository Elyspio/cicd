import {DeployConfig, Job} from "../types";
import {QueueBase, QueueIdentifier, QueueMethod} from "./base";


type DeployJob = Job<DeployConfig>

export class QueueDeployment extends QueueBase implements QueueMethod<DeployJob> {

    public add(agent: Omit<DeployJob, "lastUptime" | "availability">) {
        return super.baseAdd<DeployJob>(agent, "deployments");
    }

    public update(agent: QueueIdentifier<DeployJob>, newAgent: Partial<DeployJob>) {
        return super.baseUpdate<DeployJob>(agent, newAgent, "deployments");
    }

    public delete(agent: QueueIdentifier<DeployJob>,) {
        super.baseDelete<DeployJob>(agent, "deployments");
    }

    public list(): DeployJob[] {
        return this.baseList<DeployJob>("deployments");
    }
}

