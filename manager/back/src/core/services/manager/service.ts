import {BuildConfig, DeployConfig, ManagerConfig, ManagerConfigExport} from "./types";
import {AgentProduction} from "./agent/production";
import {AgentBuilder} from "./agent/builder";
import {files, StorageService} from "../storage";
import * as dayjs from "dayjs"
import {Queue} from "../../utils/data";
import {Services} from "../index";
import {Helper} from "../../utils/helper";
import {EventEmitter} from "events";
import {events} from "../../../config/events";
import {QueueBuild} from "./queue/build";
import {QueueDeployment} from "./queue/deployment";
import {JobBuild} from "./job/build";
import {JobDeployment} from "./job/deployment";
import {AutomateService} from "./automate";


export class ManagerService extends EventEmitter {
    public config: ManagerConfig

    public agents = {
        production: new AgentProduction(),
        builder: new AgentBuilder()
    }

    public queues = {
        builds: new QueueBuild(),
        deployments: new QueueDeployment()
    }

    public jobs = {
        builds: new JobBuild(),
        deployments: new JobDeployment()
    }

    public automate = new AutomateService()


    constructor() {
        super();
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
                jobs: {
                    builds: [],
                    deployments: []
                },
                queues: {
                    builds: new Queue(),
                    deployments: new Queue()
                },
                mappings: []
            }
            storage.store(files.conf, this.config, true);
        }
        this.watch()

    }

    public saveConfig() {
        this.emit(events.config.update, this.exportConfig())
        return Services.storage.store(files.conf, this.config);
    }

    public watch() {
        const that = this;
        setInterval(async () => {
            this.config.agents.builder.filter(a => a.availability !== "down").forEach((agent) => {
                if (dayjs(agent.lastUptime).add(1, "minute").isBefore(dayjs())) {
                    console.log(agent, "is not available")
                    that.agents.builder.update(agent, {availability: "down"})
                }
            })
            this.config.agents.production.filter(a => a.availability !== "down").forEach((agent) => {
                if (dayjs(agent.lastUptime).add(1, "minute").isBefore(dayjs())) {
                    console.log(agent, "is not available")
                    that.agents.production.update(agent, {availability: "down"})
                }
            })


            if (!this.config.queues.builds.isEmpty()) {
                for (const agent of this.config.agents.builder.filter(a => a.availability === "free")) {
                    if (this.config.queues.builds.isEmpty()) break;
                    setImmediate(async () => {
                        this.agents.builder.update(agent, {availability: "running"})
                        await this.automate.build(agent, this.config.queues.builds.dequeue()!!)
                        this.agents.builder.update(agent, {availability: "free"})
                    })
                }
            }

            if (!this.config.queues.deployments.isEmpty()) {
                for (const agent of this.config.agents.production.filter(a => a.availability === "free")) {
                    if (this.config.queues.deployments.isEmpty()) break;
                    setImmediate(async () => {
                        this.agents.production.update(agent, {availability: "running"})
                        await this.automate.deploy(agent, this.config.queues.deployments.dequeue()!!)
                        this.agents.production.update(agent, {availability: "free"})
                    })
                }
            }


        }, 1000)
    }

    async registerMapping(mapping: { build: BuildConfig; deploy: DeployConfig }) {
        if (!this.config.mappings.some(map => Helper.isEqual(mapping, map))) {
            this.config.mappings.push(mapping)
            await this.saveConfig();
        }
    }


    public exportConfig(): ManagerConfigExport {
        return {
            agents: this.config.agents,
            jobs: this.config.jobs,
            mappings: this.config.mappings,
            queues: {
                builds: this.config.queues.builds.storage,
                deployments: this.config.queues.deployments.storage,
            }
        }
    }

}


