import { Agent, BuildAgent, ProductionAgent } from "../../../core/services/hub/types";
import { Enum, Property, Required } from "@tsed/schema";

const availabilities: Agent["availability"][] = ["free", "running", "down"];

const buildAbilities: BuildAgent["abilities"] = ["docker", "docker-buildx"];
const prodAbilities: ProductionAgent["abilities"][number]["type"][] = ["docker-compose", "docker"];


export class AgentSubscribe {
	@Required()
	@Property()
	uri!: string;
}

export class AgentModel extends AgentSubscribe implements Agent {
	@Required()
	@Enum(...availabilities)
	availability: "down" | "running" | "free";

	@Property(Date)
	lastUptime: Date;
}


export class BuildAgentModelReturn extends AgentModel implements BuildAgent {
	@Required()
	@Enum(...buildAbilities)
	abilities: typeof buildAbilities[number][];
}


export class BuildAgentModelAdd extends AgentSubscribe implements Omit<BuildAgent, "availability" | "lastUptime"> {
	@Required()
	@Enum(...buildAbilities)
	abilities: typeof buildAbilities[number][];
}


class FoldersModel {
	@Required()
	@Property(String)
	apps: string[];
}

export class ProductionAgenAbilitytModel {
	@Required()
	@Enum(...prodAbilities)
	abilities: typeof prodAbilities[number][];
}


export class ProductionAgentModelAddAbilitiesDockerCompose {
	@Required()
	@Property(Boolean)
	isDockerComposeIntegratedToCli: boolean;
}

export class ProductionAgentModelAddAbilities {
	@Required()
	@Enum(...prodAbilities)
	type: "docker" | "docker-compose";


	@Property(ProductionAgentModelAddAbilitiesDockerCompose)
	dockerCompose?: ProductionAgentModelAddAbilitiesDockerCompose;
}

export class ProductionAgentModelAdd extends AgentSubscribe implements Omit<ProductionAgent, "availability" | "lastUptime"> {
	@Required()
	@Property(ProductionAgentModelAddAbilities)
	abilities: ProductionAgentModelAddAbilities[];

	@Required()
	@Property(FoldersModel)
	folders: FoldersModel;
}

export class ProductionAgentModel extends AgentModel implements ProductionAgent {
	@Required()
	@Property(ProductionAgentModelAddAbilities)
	abilities: ProductionAgentModelAddAbilities[];


	@Required()
	@Property(FoldersModel)
	folders: FoldersModel;
}


export class ProductionApplications {
	@Required()
	@Property(ProductionAgentModel)
	agent: ProductionAgent;

	@Required()
	@Property(String)
	apps: string[];

}


