import {Services} from "../../index";
import {Agent} from "../types";
import {EventEmitter} from "events";
import {ManagerConfig} from "../service";

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
        Services.manager.config.agents.production = Services.manager.config.agents.production
            .filter(a => a.uri)
            .sort((a, b) => new Date(a.lastUptime).getTime() > new Date(b.lastUptime).getTime() ? -1 : 1)
            .filter((agent, index, array) => array.findIndex(t => (t.uri === agent.uri)) === index);


        Services.manager.config.agents.builder = Services.manager.config.agents.builder
            .filter(a => a.uri)
            .sort((a, b) => new Date(a.lastUptime).getTime() > new Date(b.lastUptime).getTime() ? -1 : 1)
            .filter((agent, index, array) => array.findIndex(t => (t.uri === agent.uri)) === index);

        return Services.manager.saveConfig();
    }

    protected finishJob(id: number) {
        super.emit(this.getJobKey(id));
    }

    protected baseAdd<T extends Agent>(agent: Omit<T, "lastUptime" | "availability">, kind: keyof ManagerConfig["agents"]) {
        let existAgent = Services.manager.config.agents.builder.find(x => x.uri === agent.uri);
        if (existAgent) {
            // @ts-ignore
            Services.manager.config.agents[kind] = Services.manager.config.agents[kind].filter(ag => ag.uri !== agent.uri)
        }
        // @ts-ignore
        Services.manager.config.agents[kind].push({...agent, availability: "free", lastUptime: new Date()});
        this.save();
    }

    protected baseUpdate<T extends Agent>(agent: T | T["uri"], newAgent: Partial<T>, kind: keyof ManagerConfig["agents"]) {
        const obj = this.getAgent(agent, kind) as T;
        const updated = {...obj, ...newAgent,};
        // @ts-ignore
        Services.manager.config.agents[kind] = [...(Services.manager.config.agents[kind] as T[]).filter(a => a.uri !== (obj as T).uri), updated];
        this.save();
        return updated as T

    }

    protected baseDelete<T extends Agent>(agent: T | T["uri"], kind: keyof ManagerConfig["agents"]) {
        const obj = this.getAgent(agent, kind);
        // @ts-ignore
        Services.manager.config.agents[kind] = [...(Services.manager.config.agents[kind] as Agent[]).filter(a => a.uri === obj.uri)];
        this.save();
    }

    protected baseList<T extends Agent>(kind: keyof ManagerConfig["agents"]) {
        // @ts-ignore
        return Services.manager.config.agents[kind] as T[]
    }

    private getJobKey(id) {
        return `${this.EVENT.jobFinished}-${id}`
    }

    private getAgent<T extends Agent>(agent: T | T["uri"], kind: keyof ManagerConfig["agents"]) {
        if (typeof agent === "string") {
            // @ts-ignore
            agent = Services.manager.config.agents[kind].find(a => a.uri === agent) as T;
        }
        return agent;
    }


}
