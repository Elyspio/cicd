import {BuildConfig, DeployConfig, ProductionAgent} from "../../../../../../back/src/core/services/manager/types";

export type DockerfilesParams = {
	dockerfile: BuildConfig["docker"]["dockerfiles"][number] & { use: boolean },
	platforms: BuildConfig["docker"]["platforms"],
}[];


export type Deployment = {
	agent: ProductionAgent,
	config: DeployConfig
}
