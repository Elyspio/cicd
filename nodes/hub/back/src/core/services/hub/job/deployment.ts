import { DeployConfig, Job } from "../types";
import { Service } from "@tsed/common";
import { JobRepository } from "../../../database/repositories/job.repository";
import { JobIdentifier } from "./types";

type DeployJob = Job<DeployConfig>;

@Service()
export class JobDeployment {
	private repositories: { jobs: JobRepository };

	constructor(jobs: JobRepository) {
		this.repositories = {
			jobs,
		};
	}

	public async add(job: Omit<DeployJob, "lastUptime" | "availability">) {
		await this.repositories.jobs.add("deployments", job);
	}

	public update(id: JobIdentifier<DeployJob>, data: Partial<DeployJob>) {
		return this.repositories.jobs.update("deployments", { ...data, id });
	}

	public async delete(id: JobIdentifier<DeployJob>) {
		await this.repositories.jobs.delete("deployments", id);
	}

	public list(): Promise<DeployJob[]> {
		return this.repositories.jobs.list("deployments");
	}

	public addStdout(id: JobIdentifier<DeployJob>, stdout: string) {
		return this.repositories.jobs.addStdout("deployments", id, stdout);
	}
}
