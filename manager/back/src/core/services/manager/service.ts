import {Agent, BuildAgent, BuildConfig, DeployConfig, ProductionAgent} from "./types";
import {Production} from "./agent/production";
import {Builder} from "./agent/builder";
import {files, StorageService} from "../storage";
import * as dayjs from "dayjs"
import {Queue} from "../../utils/data";

export interface ManagerConfig {
    agents: {
        production: ProductionAgent[],
        builder: BuildAgent[]
    },
    queues: {
        builds: Queue<BuildConfig>
        deployments: Queue<DeployConfig>
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
            this.config.queues = {
                deployments: new Queue(),
                builds: new Queue()
            }
            this.config.queues.builds.storage.forEach(value => {
                this.config.queues.builds.enqueue(value)
            })
            this.config.queues.deployments.storage.forEach(value => {
                this.config.queues.deployments.enqueue(value)
            })

        } catch (e) {
            this.config = {
                agents: {
                    builder: [],
                    production: []
                },
                queues: {
                    builds: new Queue(),
                    deployments: new Queue()
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


            if(!this.config.queues.builds.isEmpty()) {
                for (const agent of this.config.agents.builder.filter(a => a.availability === "free")) {
                    if(this.config.queues.builds.isEmpty()) break;
                    this.builder.build(agent, this.config.queues.builds.dequeue())
                }
            }

            if(!this.config.queues.deployments.isEmpty()) {
                for (const agent of this.config.agents.production.filter(a => a.availability === "free")) {
                    if(this.config.queues.deployments.isEmpty()) break;
                    this.production.deploy(agent, this.config.queues.deployments.dequeue())
                }
            }


        }, 1000)
    }
}


