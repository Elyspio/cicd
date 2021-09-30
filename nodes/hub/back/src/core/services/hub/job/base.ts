import { Services } from "../../index";
import { Config, HubConfig, Job } from "../types";

export type JobIdentifier<T extends Job<Config>> = T["id"] | T


export interface JobMethods<T extends Job<Config>> {
	add: (job: Omit<T, "lastUptime" | "availability">) => void;
	delete: (job: T | T["id"]) => void;
	update: (job: T | T["id"], data: Partial<T>) => T;
	list: () => T[];
}


export class JobBase {

	save() {
		return Services.hub.saveConfig();
	}

	protected baseAdd<T extends Job<Config>>(job: T, kind: keyof HubConfig["jobs"]) {
		// @ts-ignore
		let existAgent = Services.hub.config.jobs[kind].find((x: T) => x.id === job.id);
		if (existAgent) {
			// @ts-ignore
			Services.hub.config.jobs[kind] = Services.hub.config.jobs[kind].filter((ag: T) => ag.id !== job.id);
		}
		// @ts-ignore
		Services.hub.config.jobs[kind].push(job);
		this.save();
	}

	protected baseUpdate<T extends Job<Config>>(job: T | T["id"], newAgent: Partial<T>, kind: keyof HubConfig["jobs"]) {
		const obj = this.getAgent(job, kind) as T;
		const updated = { ...obj, ...newAgent };
		// @ts-ignore
		Services.hub.config.jobs[kind] = [...(Services.hub.config.jobs[kind] as T[]).filter(a => a.id !== (obj as T).id), updated];
		this.save();
		return updated as T;

	}

	protected baseDelete<T extends Job<Config>>(job: T | T["id"], kind: keyof HubConfig["jobs"]) {
		const obj = this.getAgent(job, kind);
		// @ts-ignore
		Services.hub.config.jobs[kind] = [...(Services.hub.config.jobs[kind] as T[]).filter(a => a.id === obj.id)];
		this.save();
	}

	protected baseList<T extends Job<Config>>(kind: keyof HubConfig["jobs"]) {
		// @ts-ignore
		return Services.hub.config.jobs[kind] as T[];
	}

	private getAgent<T extends Job<Config>>(job: T | T["id"], kind: keyof HubConfig["jobs"]) {
		if (typeof job === "number") {
			// @ts-ignore
			job = Services.hub.config.jobs[kind].find(a => a.id === job) as T;
		}
		return job;
	}


}
