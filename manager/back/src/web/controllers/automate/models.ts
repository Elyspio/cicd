import {BuildAgent, ProductionAgent} from "../../../core/services/manager/types"
import {Enum, Property} from "@tsed/schema";


export class BuildAgentModelReturn implements BuildAgent {
    @Enum("docker")
    ability: "docker";
    @Enum("down", "running", "free")
    availability: "down" | "running" | "free";
    @Property()
    uri: string;

}
export class BuildAgentModelAdd implements Omit<BuildAgent, "availability"> {
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

export class ProductionAgentModel implements ProductionAgent {
    @Property(DockerModel)
    docker: { compose: { path: string }[] };
    @Property()
    uri: string;
}
