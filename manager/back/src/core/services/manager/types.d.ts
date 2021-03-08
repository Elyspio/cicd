export interface ProductionAgent extends Agent {
    abilities: ("docker" | "docker-compose")[]
}


export interface BuildAgent extends Agent {
    abilities: ("docker" | "docker-buildx")[]

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
        }[],
        username: string,
        platforms: string[]
    }
}

export interface DeployConfig extends Pick<ProductionAgent, "uri"> {
    docker?: {
        compose?: {
            path: string
        }
    }
}
