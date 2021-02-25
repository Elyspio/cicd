export interface ProductionAgent {
    uri: string,
    docker: {
        compose: {
            path: string
        }[]
    }
}


export interface BuildAgent {
    uri: string,
    availability: "down" | "running" | "free",
    ability: "docker"
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
