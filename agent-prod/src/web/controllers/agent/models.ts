import {Description, Property, Required} from "@tsed/schema";
import {DeployConfig} from "../../../../../manager/back/src/core/services/manager/types";

export class DockerComposeField {
    @Property()
    @Description("Path where the docker-compose.yml file is")
    path: string;
}

export class DockerField {
    @Property(DockerComposeField)
    compose?: DockerComposeField
}

export class DeployConfigModel implements DeployConfig {
    @Property(DockerField)
    @Description("Docker/Docker-Compose configuration")
    @Required()
    docker: DockerField

    @Property()
    @Required()
    @Description("URI of the production agent")
    uri: string;
}
