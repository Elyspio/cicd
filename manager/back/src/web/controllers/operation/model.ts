import {Description, Example, Property, Required} from "@tsed/schema";
import {BuildConfig} from "../../../core/services/manager/types";

class DockerFileConfigModel {
    @Description("Path to Dockerfile file")
    @Property()
    @Required()
    path: string

    @Description("Working directory from origin")
    @Property()
    @Required()
    wd: string

    @Description("Name for the image")
    @Property()
    @Required()
    image: string

    @Description("Tag for the image")
    @Property()
    tag: string
}

class DockerConfigModel {
    @Description("Dockerfiles to build")
    @Property(DockerFileConfigModel)
    @Required()
    dockerfiles: DockerFileConfigModel[]

    @Description("Platforms available for the future image")
    @Example("linux/arm64", "linux/amd64")
    @Required()
    @Property()
    platforms: string[];

    @Required()
    @Property()
    username: string

}

class GithubConfigModel {
    @Description("Url of the repo")
    @Required()
    @Property()
    remote: string

    @Property()
    @Description("Branch on the repo")
    @Required()
    branch: string

    @Property()
    @Description("Commit Sha")
    commit?: string
}

export class BuildConfigModel implements BuildConfig {
    @Description("Github configuration")
    @Property(GithubConfigModel)
    @Required()
    github: GithubConfigModel

    @Description("Docker configuration")
    @Required()
    @Property(DockerConfigModel)
    docker: DockerConfigModel
}

