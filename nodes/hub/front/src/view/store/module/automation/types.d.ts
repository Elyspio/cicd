import {BuildConfig} from "../../../../../../back/src/core/services/hub/types";
import {DeployConfigModel, ProductionAgentModelAdd} from "../../../../core/apis/backend/generated";

export type DockerfilesParams = {
	dockerfile: BuildConfig["dockerfiles"]["dockerfiles"][number] & { use: boolean },
	platforms: BuildConfig["dockerfiles"]["platforms"],
}[];


export type Deployment = {
	agent: ProductionAgentModelAdd,
	config: DeployConfigModel
}
