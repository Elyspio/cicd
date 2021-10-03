import { DeployConfig, Job } from "../types";
import { QueueIdentifier } from "./types";
import { Service } from "@tsed/common";
import { QueueRepository } from "../../../database/repositories/queue.repository";

type DeployJob = Job<DeployConfig>;

@Service()
export class QueueProduction {
	private repositories: { queues: QueueRepository };

	constructor(queues: QueueRepository) {
		this.repositories = {
			queues,
		};
	}

	public enqueue(agent: Omit<DeployJob, "lastUptime" | "availability">) {
		return this.repositories.queues.enqueue("deployments", agent);
	}

	public update(id: QueueIdentifier<DeployJob>, newAgent: Partial<DeployJob>) {
		return this.repositories.queues.update("deployments", { ...newAgent, id });
	}

	public delete(agent: QueueIdentifier<DeployJob>) {
		return this.repositories.queues.delete("deployments", agent);
	}

	public list(): Promise<DeployJob[]> {
		return this.repositories.queues.list("deployments");
	}

	public async dequeue(): Promise<DeployJob | null> {
		const data = await this.list();
		const last = data.shift();
		if (!last) return null;
		await this.delete(last.id);
		return last;
	}
}
