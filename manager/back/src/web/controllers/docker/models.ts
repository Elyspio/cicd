import {Any, Description, Enum, Property} from "@tsed/schema";
import {BuildConfig} from "../../../core/services/manager/types";

export enum Preset {
    webFront = "web-front",
    webBack = "web-back",
}

export class GetDockerFileModel {
    @Enum(Preset)
    preset: Preset[]
}

class DockerFileConfigModel {
    @Description("Path to Dockerfile file")
    @Property()
    path: string

    @Description("Working directory from origin")
    @Property()
    wd: string
}

class DockerConfigModel {
    @Description("name of the image")
    @Property()
    image: string

    @Description("Dockerfiles to build")
    @Property(DockerFileConfigModel)
    dockerfiles: DockerFileConfigModel[]
}

class GithubConfigModel {
    @Description("Url of the repo")
    @Property()
    repo: string

    @Property("Branch on the repo")
    branch: string

    @Property("Commit Sha")
    @Any(String, undefined)
    commit?: string
}

export class BuildConfigModel implements  BuildConfig {
    @Description("Github configuration")
    @Property(GithubConfigModel)
    github: {
        remote: string,
        branch: string,
        commit?: string
    }
    @Description("Docker configuration")
    @Property(DockerConfigModel)
    docker: DockerConfigModel
}
