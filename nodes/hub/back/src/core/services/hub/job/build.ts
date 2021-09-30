import { BuildConfig, Job } from "../types";
import { JobBase, JobIdentifier, JobMethods } from "./base";


type BuildJob = Job<BuildConfig>;

export class JobBuild extends JobBase implements JobMethods<BuildJob> {

	public add(agent: Omit<BuildJob, "lastUptime" | "availability">) {
		return super.baseAdd<BuildJob>(agent, "builds");
	}

	public update(agent: JobIdentifier<BuildJob>, newAgent: Partial<BuildJob>) {
		return super.baseUpdate<BuildJob>(agent, newAgent, "builds");
	}

	public delete(agent: JobIdentifier<BuildJob>) {
		super.baseDelete<BuildJob>(agent, "builds");
	}

	public list(): BuildJob[] {
		return this.baseList<BuildJob>("builds");
	}
}

