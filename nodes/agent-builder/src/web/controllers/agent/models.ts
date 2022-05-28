import { Description, Enum, Property, Required } from "@tsed/schema";
import { BakeBuild, BuildConfig, Dockerfiles } from "../../../../../hub/back_node/src/core/services/hub/types";

class DockerFileConfigModel {
	@Description("Path to Dockerfile file")
	@Property()
	@Required()
	path: string;

	@Description("Working directory from origin")
	@Property()
	@Required()
	wd: string;

	@Description("Name for the image")
	@Property()
	@Required()
	image: string;

	@Description("Tag for the image")
	@Property()
	tag: string;
}

export class DockerfilesConfigModel implements Dockerfiles {
	@Description("Dockerfiles to build")
	@Property(DockerFileConfigModel)
	@Required()
	files: DockerFileConfigModel[];

	@Description("Platforms available for the future image")
	@Required()
	@Enum("linux/arm64", "linux/amd64")
	platforms: ("linux/arm64" | "linux/amd64")[];

	@Required()
	@Property()
	username: string;
}

export class DockerBakeModel implements BakeBuild {
	@Required()
	@Property()
	bakeFilePath: string;
}

class GithubConfigModel {
	@Description("Url of the repo")
	@Required()
	@Property()
	remote: string;

	@Description("Branch on the repo")
	@Property()
	@Required()
	branch: string;

	@Description("Commit Sha")
	@Property()
	commit?: string;
}

class GithubDockerModel implements BuildConfig {
	@Description("Github configuration")
	@Property(GithubConfigModel)
	@Required()
	github: GithubConfigModel;

	@Description("Docker bake configuration")
	@Property(DockerBakeModel)
	bake?: DockerBakeModel;

	@Description("Dockerfiles configuration")
	@Property(DockerfilesConfigModel)
	dockerfiles?: DockerfilesConfigModel;
}

export class BuildConfigModel {
	@Property(GithubDockerModel)
	config: GithubDockerModel;

	@Property()
	id: string;
}

export class BuildResult {

	@Property()
	@Required()
	stdout: string;
	@Property()
	@Required()
	stderr: string;
	@Property(Number)
	@Required()
	status: number
}
