import {Agent, BuildAgent, ProductionAgent} from "../../../core/services/manager/types"
import {Enum, Property} from "@tsed/schema";


export class AgentModel implements Agent {
    @Enum("down", "running", "free")
    availability: "down" | "running" | "free";
    @Property()
    uri: string;
    @Property(Date)
    lastUptime: Date;
}

export class BuildAgentModelReturn extends AgentModel implements BuildAgent {
    @Enum("docker")
    ability: "docker";
}


export class BuildAgentModelAdd implements Omit<BuildAgent, "availability" | "lastUptime"> {
    @Enum("docker")
    ability: "docker";
    @Property()
    uri: string;
}

class DockerComposeModel {
    @Property()
    path: string
}

class DockerModel {
    @Property(DockerComposeModel)
    compose: DockerComposeModel[]
}

export class ProductionAgentModel extends AgentModel implements Omit<ProductionAgent, "lastUptime"> {
    @Property(DockerModel)
    docker: { compose: { path: string }[] };
}
