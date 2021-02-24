import {BuildAgent, ProductionAgent} from "./types";
import {Services} from "../index";
import {files} from "../storage";

export interface ManagerConfig {
    agents: {
        production: ProductionAgent[],
        builder: BuildAgent[]
    }
}

export class ManagerService {

    private readonly config: ManagerConfig

    agents = {
        production: {
            add: (agent: ProductionAgent) => {
                this.config.agents.production.push(agent);
                this.save();
            }
        },
        builder: {
            add: (agent: Omit<BuildAgent, "availability">) => {
                this.config.agents.builder.push({...agent, availability: "free"});
                this.save();
            }
        }
    }

    constructor() {
        this.config = Services.storage.readSync<ManagerConfig>(files.conf) ?? {
            agents: {
                builder: [],
                production: []
            }
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
