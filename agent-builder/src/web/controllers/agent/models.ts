import {Description, Enum, Property, Required} from "@tsed/schema";
import {BuildConfig, Job, Timestamp} from "../../../../../manager/back/src/core/services/manager/types";


type Docker = BuildConfig["docker"]


class JobModel {
	@Required()
	@Description("Job id")
	id: number
}

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

class DockerConfigModel implements Docker {
	@Description("Dockerfiles to build")
	@Property(DockerFileConfigModel)
	@Required()
	dockerfiles: DockerFileConfigModel[]

	@Description("Platforms available for the future image")
	@Required()
	@Enum("linux/arm64", "linux/amd64")
	platforms: ("linux/arm64" | "linux/amd64")[];

	@Required()
	@Property()
	username: string
}

class GithubConfigModel {
	@Description("Url of the repo")
	@Required()
	@Property()
	remote: string

	@Description("Branch on the repo")
	@Property()
	@Required()
	branch: string

	@Description("Commit Sha")
	@Property()
	commit?: string
}


class GithubDockerModel implements BuildConfig {
	@Description("Github configuration")
	@Property(GithubConfigModel)
	@Required()
	github: GithubConfigModel

	@Description("Docker configuration")
	@Required()
	@Property(DockerConfigModel)
	docker: DockerConfigModel

}

export class BuildConfigModel extends JobModel implements Omit<Job<BuildConfig>, keyof Timestamp> {
	@Property(GithubDockerModel)
	config: GithubDockerModel
}
