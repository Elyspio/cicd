import {BuildAgent, BuildConfig} from "../types";
import {AgentIdentifier, AgentMethods, Base} from "./base";
import {Services} from "../../index";


export class AgentBuilder extends Base implements AgentMethods<BuildAgent> {


	public add(agent: Omit<BuildAgent, "lastUptime" | "availability">) {
		return super.baseAdd<BuildAgent>(agent, "builder");
	}

	public update(agent: AgentIdentifier<BuildAgent>, newAgent: Partial<BuildAgent>) {
		return super.baseUpdate<BuildAgent>(agent, newAgent, "builder");
	}

	public delete(agent: AgentIdentifier<BuildAgent>,) {
		super.baseDelete<BuildAgent>(agent, "builder");
	}

	public list(): BuildAgent[] {
		return this.baseList<BuildAgent>("builder");
	}

	public keepAlive(agent: AgentIdentifier<BuildAgent>): void {
		this.update(agent, {availability: "free", lastUptime: new Date()});
	}

	public askBuild(config: BuildConfig) {
		const id = super.nextId;
		Services.hub.config.queues.builds.enqueue({config: config, createdAt: new Date(), finishedAt: null, startedAt: null, id})
		super.save();
		return id;
	}

	public get(uri: AgentIdentifier<BuildAgent>) {
		return Services.hub.config.agents.builder.find(a => a.uri === uri)
	}


}

