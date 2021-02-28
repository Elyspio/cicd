export interface ProductionAgent extends Agent {
    docker: {
        compose: {
            path: string
        }[]
    }
}


export type Abilities = "docker";

export interface BuildAgent extends Agent {
    ability: Abilities[]
}

export interface Agent {
    uri: string,
    availability: "down" | "running" | "free",
    lastUptime: Date
}

export interface BuildConfig {
    github: {
        remote: string,
        branch: string,
        commit?: string
    },
    docker: {
        dockerfiles: {
            path: string,
            wd: string
            image: string
            tag?: string
        }[]
    }
}

export interface DeployConfig extends Pick<ProductionAgent, "uri">{
    docker?: {
        compose?: {
            path: string
        }
    }
}
