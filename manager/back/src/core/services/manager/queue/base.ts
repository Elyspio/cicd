import {Services} from "../../index";
import {Config, Job, ManagerConfig} from "../types";

export type QueueIdentifier<T extends Job<Config>> = T["id"] | T


export interface QueueMethod<T extends Job<Config>> {
    add: (job: Omit<T, "lastUptime" | "availability">) => void
    delete: (job: T | T["id"]) => void
    update: (job: T | T["id"], data: Partial<T>) => T
    list: () => T[]
}


export class QueueBase {

    save() {
        return Services.manager.saveConfig();
    }

    protected baseAdd<T extends Job<Config>>(job: T, kind: keyof ManagerConfig["queues"]) {
        // @ts-ignore
        let existAgent = Services.manager.config.queues[kind].storage.find(x => x.id === job.id);
        if (existAgent) {
            // @ts-ignore
            Services.manager.config.queues[kind].storage = Services.manager.config.queues[kind].storage.filter(ag => ag.id !== job.id)
        }
        // @ts-ignore
        Services.manager.config.queues[kind].enqueue(job);
        this.save();
    }

    protected baseUpdate<T extends Job<Config>>(job: T | T["id"], newAgent: Partial<T>, kind: keyof ManagerConfig["queues"]) {
        const obj = this.getAgent(job, kind) as T;
        const updated = {...obj, ...newAgent,};
        // @ts-ignore
        Services.manager.config.queues[kind].storage = [...(Services.manager.config.queues[kind].storage as T[]).filter(a => a.id !== (obj as T).id), updated];
        this.save();
        return updated as T

    }

    protected baseDelete<T extends Job<Config>>(job: T | T["id"], kind: keyof ManagerConfig["queues"]) {
        const obj = this.getAgent(job, kind);
        // @ts-ignore
        Services.manager.config.queues[kind].storage = [...(Services.manager.config.queues[kind].storage as T[]).filter(a => a.id === obj.id)];
        this.save();
    }

    protected baseList<T extends Job<Config>>(job: keyof ManagerConfig["queues"]) {
        // @ts-ignore
        return Services.manager.config.queues[job].storage as T[]
    }

    private getAgent<T extends Job<Config>>(job: T | T["id"], kind: keyof ManagerConfig["queues"]) {
        if (typeof job === "number") {
            // @ts-ignore
            job = Services.manager.config.queues[kind].storage.find(a => a.id === job) as T;
        }
        return job;
    }


}
