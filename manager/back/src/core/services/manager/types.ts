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
