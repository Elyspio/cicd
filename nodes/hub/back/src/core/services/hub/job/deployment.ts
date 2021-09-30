import { DeployConfig, Job } from "../types";
import { JobBase, JobIdentifier, JobMethods } from "./base";


type DeployJob = Job<DeployConfig>

export class JobDeployment extends JobBase implements JobMethods<DeployJob> {

	public add(agent: Omit<DeployJob, "lastUptime" | "availability">) {
		return super.baseAdd<DeployJob>(agent, "deployments");
	}

	public update(agent: JobIdentifier<DeployJob>, newAgent: Partial<DeployJob>) {
		return super.baseUpdate<DeployJob>(agent, newAgent, "deployments");
	}

	public delete(agent: JobIdentifier<DeployJob>) {
		super.baseDelete<DeployJob>(agent, "deployments");
	}

	public list(): DeployJob[] {
		return this.baseList<DeployJob>("deployments");
	}
}

