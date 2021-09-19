import {BuildConfig} from "../../../../../../back/src/core/services/hub/types";
import {DeployConfigModel, ProductionAgentModelAdd} from "../../../../core/apis/backend/generated";

export type DockerfilesParams = {
	dockerfile: BuildConfig["docker"]["dockerfiles"][number] & { use: boolean },
	platforms: BuildConfig["docker"]["platforms"],
}[];


export type Deployment = {
	agent: ProductionAgentModelAdd,
	config: DeployConfigModel
}
