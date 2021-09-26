import {Description, Enum, Property, Required} from "@tsed/schema";
import {BakeBuild, BuildConfig, DeployConfig, HubConfigExport, Mapping} from "../../../core/services/hub/types";
import {BuildAgentModelReturn, ProductionAgentModel} from "../automate/models";

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
	@Required()
	@Enum("linux/arm64", "linux/amd64")
	platforms: ("linux/arm64" | "linux/amd64")[];

	@Required()
	@Property()
	username: string

}


export class DockerBakeModel implements BakeBuild {
	@Required()
	@Property()
	bakeFilePath: string
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

	@Description("dockerfiles to build")
	@Property(DockerConfigModel)
	dockerfiles?: DockerConfigModel

	@Description("bake file to use")
	@Property(DockerBakeModel)
	bake?: DockerBakeModel


}


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


export class MappingModel implements Mapping {

	@Property(BuildConfigModel)
	@Required()
	build: BuildConfig;

	@Property(DeployConfigModel)
	@Required()
	deploy: DeployConfig;

	@Property()
	@Required()
	id: number;

}

class HubAgentConfig {
	@Property(ProductionAgentModel)
	@Required()
	production: ProductionAgentModel[];

	@Property(BuildAgentModelReturn)
	@Required()
	builder: BuildAgentModelReturn[]
}

class JobBuildModel {
	@Property()
	@Required()
	createdAt: Date

	@Property()
	startedAt: Date

	@Property()
	finishedAt: Date

	@Property()
	@Required()
	id: number

	@Property("T")
	@Required()
	config: BuildConfigModel
}

class JobDeployModel {
	@Property()
	@Required()
	createdAt: Date

	@Property()
	startedAt: Date

	@Property()
	finishedAt: Date

	@Property()
	@Required()
	id: number

	@Property("T")
	@Required()
	config: DeployConfigModel
}

class JobsModel {
	@Property(JobBuildModel)
	@Required()
	builds: JobBuildModel[];

	@Property(JobDeployModel)
	@Required()
	deployments: JobDeployModel[]
}

export class HubConfig implements HubConfigExport {
	@Property(HubAgentConfig)
	@Required()
	agents: HubAgentConfig

	@Property(JobsModel)
	@Required()
	jobs: JobsModel;

	@Property(MappingModel)
	@Required()
	mappings: MappingModel[];

	@Property(JobsModel)
	@Required()
	queues: JobsModel
}


