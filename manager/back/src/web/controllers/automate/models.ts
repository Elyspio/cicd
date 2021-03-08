import {Agent, BuildAgent, ProductionAgent} from "../../../core/services/manager/types"
import {Enum, Property, Required} from "@tsed/schema";

const availabilities: Agent["availability"][] = ["free", "running", "down"]

const buildAbilities: BuildAgent["abilities"] = ["docker", "docker-buildx"]
const prodAbilities: ProductionAgent["abilities"] = ["docker", "docker-compose"]

export class AgentModel implements Agent {
    @Required()
    @Property()
    uri: string;

    @Enum(...availabilities)
    availability: "down" | "running" | "free";

    @Property(Date)
    lastUptime: Date;

}

export class BuildAgentModelReturn extends AgentModel implements BuildAgent {
    @Required()
    @Enum(...buildAbilities)
    abilities: BuildAgent["abilities"];
}


export class BuildAgentModelAdd extends AgentModel implements Omit<BuildAgent, "availability" | "lastUptime"> {
    @Required()
    @Enum(...buildAbilities)
    abilities: BuildAgent["abilities"];
}


export class ProductionAgentModel extends AgentModel implements Omit<ProductionAgent, "availability" | "lastUptime"> {
    @Required()
    @Enum(...prodAbilities)
    abilities: ProductionAgent["abilities"];
}
