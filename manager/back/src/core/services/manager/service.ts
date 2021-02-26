import {Agent, BuildAgent, ProductionAgent} from "./types";
import {Production} from "./production";
import {Builder} from "./builder";
import {files, StorageService} from "../storage";
import * as dayjs from "dayjs"

export interface ManagerConfig {
    agents: {
        production: ProductionAgent[],
        builder: BuildAgent[]
    }
}

export interface ManagerMethods<T extends Agent> {
    add: (agent: Omit<T, "lastUptime" | "availability">) => void
    delete: (agent: T | T["uri"]) => void
    update: (agent: T | T["uri"], data: Partial<T>) => T
    keepAlive: (agent: T | T["uri"]) => void
    list: () => T[]
}

export class ManagerService {
    public production: Readonly<Production> = new Production()
    public builder: Readonly<Builder> = new Builder()
    public config: ManagerConfig

    constructor() {
        let storage = new StorageService();
        try {
            this.config = storage.readSync<ManagerConfig>(files.conf)
        } catch (e) {
            this.config = {
                agents: {
                    builder: [],
                    production: []
                }
            }
            storage.store(files.conf, this.config, true);
        }
        this.watch()

    }

    public watch() {
        const that = this;
        setInterval(() => {
            this.config.agents.builder.filter(a => a.availability !== "down").forEach((agent) => {
                if (dayjs(agent.lastUptime).add(1, "minute").isBefore(dayjs())) {
                    console.log(agent, "is not available")
                    that.builder.update(agent, {availability: "down"})
                }
            })
            this.config.agents.production.filter(a => a.availability !== "down").forEach((agent) => {
                if (dayjs(agent.lastUptime).add(1, "minute").isBefore(dayjs())) {
                    console.log(agent, "is not available")
                    that.production.update(agent, {availability: "down"})
                }
            })
        }, 1000)
    }
}


