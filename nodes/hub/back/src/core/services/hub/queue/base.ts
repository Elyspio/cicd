import { Services } from "../../index";
import { Config, HubConfig, Job } from "../types";

export type QueueIdentifier<T extends Job<Config>> = T["id"] | T


export interface QueueMethod<T extends Job<Config>> {
	add: (job: Omit<T, "lastUptime" | "availability">) => void;
	delete: (job: T | T["id"]) => void;
	update: (job: T | T["id"], data: Partial<T>) => T;
	list: () => T[];
}


export class QueueBase {

	save() {
		return Services.hub.saveConfig();
	}

	protected baseAdd<T extends Job<Config>>(job: T, kind: keyof HubConfig["queues"]) {
		// @ts-ignore
		let existAgent = Services.hub.config.queues[kind].storage.find(x => x.id === job.id);
		if (existAgent) {
			// @ts-ignore
			Services.hub.config.queues[kind].storage = Services.hub.config.queues[kind].storage.filter(ag => ag.id !== job.id);
		}
		// @ts-ignore
		Services.hub.config.queues[kind].enqueue(job);
		this.save();
	}

	protected baseUpdate<T extends Job<Config>>(job: T | T["id"], newAgent: Partial<T>, kind: keyof HubConfig["queues"]) {
		const obj = this.getAgent(job, kind) as T;
		const updated = { ...obj, ...newAgent };
		// @ts-ignore
		Services.hub.config.queues[kind].storage = [...(Services.hub.config.queues[kind].storage as T[]).filter(a => a.id !== (obj as T).id), updated];
		this.save();
		return updated as T;

	}

	protected baseDelete<T extends Job<Config>>(job: T | T["id"], kind: keyof HubConfig["queues"]) {
		const obj = this.getAgent(job, kind);
		// @ts-ignore
		Services.hub.config.queues[kind].storage = [...(Services.hub.config.queues[kind].storage as T[]).filter(a => a.id === obj.id)];
		this.save();
	}

	protected baseList<T extends Job<Config>>(job: keyof HubConfig["queues"]) {
		// @ts-ignore
		return Services.hub.config.queues[job].storage as T[];
	}

	private getAgent<T extends Job<Config>>(job: T | T["id"], kind: keyof HubConfig["queues"]) {
		if (typeof job === "number") {
			// @ts-ignore
			job = Services.hub.config.queues[kind].storage.find(a => a.id === job) as T;
		}
		return job;
	}


}
