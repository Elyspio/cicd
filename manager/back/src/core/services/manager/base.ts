import {files, StorageService} from "../storage";
import {Production} from "./production";
import {Builder} from "./builder";
import {Services} from "../index";
import {Agent} from "./types";
import {ManagerConfig} from "./service";

export class Base {


    save() {
        return Services.storage.store(files.conf, Services.manager.config);
        // TODO AJouter un appel vers le websocket
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
        const updated = { ...obj , ...newAgent,};
        // @ts-ignore
        Services.manager.config.agents[kind] = [...(Services.manager.config.agents[kind] as Agent[]).filter(a => a.uri !== (obj as T).uri), updated];
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
        return Services.manager.config.agents[kind].filter((a: Agent) => a.availability !== "down") as T[]
    }

    private getAgent<T extends Agent>(agent: T | T["uri"], kind: keyof ManagerConfig["agents"]) {
        if (typeof agent === "string") {
            // @ts-ignore
            agent = Services.manager.config.agents[kind].find(a => a.uri === agent) as T;
        }
        return agent;
    }



}
