export interface ProductionAgent extends Agent {
    docker: {
        compose: {
            path: string
        }[]
    }
}


export interface BuildAgent extends Agent {
    ability: "docker"
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
        image: string,
        dockerfiles: {
            path: string,
            wd: string
        }[]
    }
}
