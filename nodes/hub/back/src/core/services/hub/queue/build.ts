import { BuildConfig, Job } from "../types";
import { QueueIdentifier } from "./types";
import { Service } from "@tsed/common";
import { QueueRepository } from "../../../database/repositories/queue.repository";

type BuildJob = Job<BuildConfig>;

@Service()
export class QueueBuild {
	private repositories: { queues: QueueRepository };

	constructor(queues: QueueRepository) {
		this.repositories = {
			queues,
		};
	}

	public enqueue(agent: Omit<BuildJob, "lastUptime" | "availability">) {
		return this.repositories.queues.enqueue("builds", agent);
	}

	public update(id: QueueIdentifier<BuildJob>, newAgent: Partial<BuildJob>) {
		return this.repositories.queues.update("builds", { ...newAgent, id });
	}

	public delete(agent: QueueIdentifier<BuildJob>) {
		return this.repositories.queues.delete("builds", agent);
	}

	public list(): Promise<BuildJob[]> {
		return this.repositories.queues.list("builds");
	}

	public async dequeue(): Promise<BuildJob | null> {
		const data = await this.list();
		const last = data.shift();
		if (!last) return null;
		await this.delete(last.id);
		return last;
	}
}
