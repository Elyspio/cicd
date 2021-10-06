import { BuildConfig, Job } from "../types";
import { Service } from "@tsed/common";
import { JobRepository } from "../../../database/repositories/job.repository";
import { JobIdentifier } from "./types";

type BuildJob = Job<BuildConfig>;

@Service()
export class JobBuild {
	private repositories: { jobs: JobRepository };

	constructor(jobs: JobRepository) {
		this.repositories = {
			jobs,
		};
	}

	public async add(job: Omit<BuildJob, "lastUptime" | "availability">) {
		await this.repositories.jobs.add("builds", job);
	}

	public update(id: JobIdentifier<BuildJob>, data: Partial<BuildJob>) {
		return this.repositories.jobs.update("builds", { ...data, id });
	}

	public async delete(id: JobIdentifier<BuildJob>) {
		await this.repositories.jobs.delete("builds", id);
	}

	public list(): Promise<BuildJob[]> {
		return this.repositories.jobs.list("builds");
	}

	public addStdout(id: JobIdentifier<BuildJob>, stdout: string) {
		return this.repositories.jobs.addStdout("builds", id, stdout);
	}
}
