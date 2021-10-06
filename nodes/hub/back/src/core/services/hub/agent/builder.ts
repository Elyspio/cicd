import { BuildAgent, BuildConfig } from "../types";
import { AgentIdentifier } from "./types";
import { OnReady, Service } from "@tsed/common";
import { AgentRepository } from "../../../database/repositories/agent.repository";
import { QueueRepository } from "../../../database/repositories/queue.repository";
import { AgentBase } from "./base";
import { JobRepository } from "../../../database/repositories/job.repository";

@Service()
export class AgentBuild extends AgentBase implements OnReady {
	private repositories: { agent: AgentRepository; queue: QueueRepository; job: JobRepository };
	private id: number;

	constructor(agentRepository: AgentRepository, queueRepository: QueueRepository, jobRepository: JobRepository) {
		super();
		this.repositories = {
			agent: agentRepository,
			queue: queueRepository,
			job: jobRepository,
		};
	}

	public async $onReady() {
		const jobs = await this.repositories.job.list("builds");
		this.id = jobs.reduce((acc, val) => {
			if (val.id > acc) return val.id;
			return acc;
		}, 0);
	}

	public async add(agent: Omit<BuildAgent, "lastUptime" | "availability">) {
		await this.repositories.agent.add("builds", agent);
	}

	public update(uri: AgentIdentifier<BuildAgent>, data: Partial<BuildAgent>) {
		return this.repositories.agent.update("builds", { ...data, uri });
	}

	public async delete(uri: AgentIdentifier<BuildAgent>) {
		await this.repositories.agent.delete("builds", uri);
	}

	public list(): Promise<BuildAgent[]> {
		return this.repositories.agent.list("builds");
	}

	public async askBuild(config: BuildConfig) {
		const id = ++this.id;
		await this.repositories.queue.enqueue("builds", { id, config });
		return id;
	}

	public async get(uri: AgentIdentifier<BuildAgent>) {
		return (await this.list()).find((a) => a.uri === uri);
	}
}
