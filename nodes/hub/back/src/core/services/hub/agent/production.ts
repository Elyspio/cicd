import { DeployAgent, DeployConfig } from "../types";
import { AgentIdentifier } from "./types";
import { OnReady, Service } from "@tsed/common";
import { AgentRepository } from "../../../database/repositories/agent.repository";
import { QueueRepository } from "../../../database/repositories/queue.repository";
import { AgentBase } from "./base";
import { ProductionApplications } from "../../../../web/controllers/operation/models";
import { AutomateApi } from "../../../apis/agent-prod";
import { JobRepository } from "../../../database/repositories/job.repository";

@Service()
export class AgentDeployment extends AgentBase implements OnReady {
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
		const jobs = await this.repositories.job.list("deployments");
		this.id = jobs.reduce((acc, val) => {
			if (val.id > acc) return val.id;
			return acc;
		}, 0);
	}

	public async add(agent: Omit<DeployAgent, "lastUptime" | "availability">) {
		await this.repositories.agent.add("deployments", agent);
	}

	public update(uri: AgentIdentifier<DeployAgent>, data: Partial<DeployAgent>) {
		return this.repositories.agent.update("deployments", { ...data, uri });
	}

	public async delete(uri: AgentIdentifier<DeployAgent>) {
		await this.repositories.agent.delete("deployments", uri);
	}

	public list(): Promise<DeployAgent[]> {
		return this.repositories.agent.list("deployments");
	}

	public async askDeploy(config: DeployConfig, appToken: string) {
		const id = ++this.id;
		await this.repositories.queue.enqueue("deployments", { id, config, token: appToken });
		return id;
	}

	public async get(uri: AgentIdentifier<DeployAgent>) {
		return (await this.list()).find((a) => a.uri === uri);
	}

	public async getApps(token: string): Promise<ProductionApplications[]> {
		const agents = await this.list();
		return await Promise.all(
			agents.map((agent) =>
				new AutomateApi(undefined, agent.uri).getApps(token).then((x) => ({
					apps: x.data,
					agent,
				}))
			)
		);
	}
}
