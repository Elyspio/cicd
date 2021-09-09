import {Services} from "../../index";
import {Agent, HubConfig} from "../types";
import {EventEmitter} from "events";

export type AgentIdentifier<T extends Agent> = T["uri"] | T


export class Base extends EventEmitter {

	private EVENT = {
		jobFinished: "JOB_FINISHED"
	}
	private currentId = 0;

	protected get nextId() {
		return this.currentId++;
	}

	public async waitForJob(id: number) {
		return new Promise<void>(resolve => {
			super.on(this.getJobKey(id), () => {
				resolve()
			})
		})

	}

	save() {
		Services.hub.config.agents.production = Services.hub.config.agents.production
			.filter(a => a.uri)
			.sort((a, b) => new Date(a.lastUptime).getTime() > new Date(b.lastUptime).getTime() ? -1 : 1)
			.filter((agent, index, array) => array.findIndex(t => (t.uri === agent.uri)) === index);


		Services.hub.config.agents.builder = Services.hub.config.agents.builder
			.filter(a => a.uri)
			.sort((a, b) => new Date(a.lastUptime).getTime() > new Date(b.lastUptime).getTime() ? -1 : 1)
			.filter((agent, index, array) => array.findIndex(t => (t.uri === agent.uri)) === index);

		return Services.hub.saveConfig();
	}

	public finishJob(id: number) {
		super.emit(this.getJobKey(id));
	}

	protected baseAdd<T extends Agent>(agent: Omit<T, "lastUptime" | "availability">, kind: keyof HubConfig["agents"]) {
		let existAgent = Services.hub.config.agents.builder.find(x => x.uri === agent.uri);
		if (existAgent) {
			// @ts-ignore
			Services.hub.config.agents[kind] = Services.hub.config.agents[kind].filter(ag => ag.uri !== agent.uri)
		}
		// @ts-ignore
		Services.hub.config.agents[kind].push({...agent, availability: "free", lastUptime: new Date()});
		this.save();
	}

	protected baseUpdate<T extends Agent>(agent: T | T["uri"], newAgent: Partial<T>, kind: keyof HubConfig["agents"]) {
		const obj = this.getAgent(agent, kind) as T;
		const updated = {...obj, ...newAgent,};
		// @ts-ignore
		Services.hub.config.agents[kind] = [...(Services.hub.config.agents[kind] as T[]).filter(a => a.uri !== (obj as T).uri), updated];
		this.save();
		return updated as T

	}

	protected baseDelete<T extends Agent>(agent: T | T["uri"], kind: keyof HubConfig["agents"]) {
		const obj = this.getAgent(agent, kind);
		// @ts-ignore
		Services.hub.config.agents[kind] = [...(Services.hub.config.agents[kind] as Agent[]).filter(a => a?.uri !== obj.uri)];
		this.save();
	}

	protected baseList<T extends Agent>(kind: keyof HubConfig["agents"]) {
		// @ts-ignore
		return Services.hub.config.agents[kind] as T[]
	}

	private getJobKey(id) {
		return `${this.EVENT.jobFinished}-${id}`
	}

	private getAgent<T extends Agent>(agent: T | T["uri"], kind: keyof HubConfig["agents"]) {
		if (typeof agent === "string") {
			// @ts-ignore
			agent = Services.hub.config.agents[kind].find(a => a.uri === agent) as T;
		}
		return agent;
	}


}

export interface AgentMethods<T extends Agent> {
	add: (agent: Omit<T, "lastUptime" | "availability">) => void
	delete: (agent: T | T["uri"]) => void
	update: (agent: T | T["uri"], data: Partial<T>) => T
	keepAlive: (agent: T | T["uri"]) => void
	get: (agent: T["uri"]) => T | undefined
	list: () => T[]
}
