import {BuildConfig, Job} from "../types";
import {QueueBase, QueueIdentifier, QueueMethod} from "./base";


type BuildJob = Job<BuildConfig>;

export class QueueBuild extends QueueBase implements QueueMethod<BuildJob> {

	public add(agent: Omit<BuildJob, "lastUptime" | "availability">) {
		return super.baseAdd<BuildJob>(agent, "builds");
	}

	public update(agent: QueueIdentifier<BuildJob>, newAgent: Partial<BuildJob>) {
		return super.baseUpdate<BuildJob>(agent, newAgent, "builds");
	}

	public delete(agent: QueueIdentifier<BuildJob>,) {
		super.baseDelete<BuildJob>(agent, "builds");
	}

	public list(): BuildJob[] {
		return this.baseList<BuildJob>("builds");
	}
}

