import {Abilities, Agent, BuildAgent, ProductionAgent} from "../../../core/services/manager/types"
import {Enum, Property, Required} from "@tsed/schema";


export class AgentModel implements Agent {
    @Required()
    @Property()
    uri: string;

    @Enum("down", "running", "free")
    availability: "down" | "running" | "free";

    @Property(Date)
    lastUptime: Date;
}

export class BuildAgentModelReturn extends AgentModel implements BuildAgent {
    @Enum("docker")
    ability: Abilities[];
}


export class BuildAgentModelAdd extends AgentModel implements Omit<BuildAgent, "availability" | "lastUptime"> {
    @Required()
    @Enum("docker")
    ability: Abilities[];

    @Required()
    @Property()
    uri: string;
}

class DockerComposeModel {
    @Property()
    @Required()
    path: string
}

class DockerModel {
    @Property(DockerComposeModel)
    @Required()
    compose: DockerComposeModel[]


}

export class ProductionAgentModel extends AgentModel implements Omit<ProductionAgent, "lastUptime"> {
    @Property(DockerModel)
    @Required()
    docker: DockerModel;
}
