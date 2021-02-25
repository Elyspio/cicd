import {BuildAgent, BuildConfig, ProductionAgent} from "./types";
import {Services} from "../index";
import {files, StorageService} from "../storage";
import {BuildConfigModel} from "../../../web/controllers/docker/models";

export interface ManagerConfig {
    agents: {
        production: ProductionAgent[],
        builder: BuildAgent[]
    }
}

export class ManagerService {

    private readonly config: ManagerConfig

    public agents = {
        production: {
            add: (agent: ProductionAgent) => {
                let existAgent = this.config.agents.production.find(x => x.uri === agent.uri);
                if (existAgent) {
                    this.config.agents.production = this.config.agents.production.filter(ag => ag.uri !== agent.uri)
                }
                this.config.agents.production.push(agent);
                this.save();
            },
        },
        builder: {
            add: (agent: Omit<BuildAgent, "availability">) => {
                let existAgent = this.config.agents.builder.find(x => x.uri === agent.uri);
                if (existAgent) {
                    this.config.agents.builder = this.config.agents.builder.filter(ag => ag.uri !== agent.uri)
                }
                this.config.agents.builder.push({...agent, availability: "free"});
                this.save();
            },
            build: (config: BuildConfig)  => {
                // todo find a build agent ask for build

            }
        }
    }

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

    }

    public get current() {
        return Object.freeze(this.config);
    }

    save() {
        return Services.storage.store(files.conf, this.config);
        // TODO AJouter un appel vers le websocket
    }


}
