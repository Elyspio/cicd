import { BuildConfigModel, DeployConfigModel, ProductionAgentModelAdd } from "../../../../core/apis/backend/generated";

type Dockerfiles = NonNullable<BuildConfigModel["dockerfiles"]>;
export type DockerfilesParams = {
	dockerfile: Dockerfiles["files"][number] & { use: boolean };
	platforms: Dockerfiles["platforms"];
}[];

export type Deployment = {
	agent: ProductionAgentModelAdd;
	config: DeployConfigModel;
};
