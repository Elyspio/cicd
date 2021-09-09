import {Agent, BuildAgent, ProductionAgent} from "../../../core/services/hub/types"
import {Enum, Property, Required} from "@tsed/schema";

const availabilities: Agent["availability"][] = ["free", "running", "down"]

const buildAbilities: BuildAgent["abilities"] = ["docker", "docker-buildx"]
const prodAbilities: ProductionAgent["abilities"] = ["docker", "docker-compose"]


export class AgentSubscribe {
	@Required()
	@Property()
	uri: string;
}

export class AgentModel extends AgentSubscribe implements Agent {
	@Required()
	@Property()
	uri: string;

	@Enum(...availabilities)
	availability: "down" | "running" | "free";

	@Property(Date)
	lastUptime: Date;

}


export class BuildAgentModelReturn extends AgentModel implements BuildAgent {
	@Required()
	@Enum(...buildAbilities)
	abilities: typeof buildAbilities[number][]
}


export class BuildAgentModelAdd extends AgentSubscribe implements Omit<BuildAgent, "availability" | "lastUptime"> {
	@Required()
	@Enum(...buildAbilities)
	abilities: typeof buildAbilities[number][]
}


class FoldersModel {
	@Required()
	@Property(String)
	apps: string[]
}

export class ProductionAgentModelAdd extends AgentSubscribe implements Omit<ProductionAgent, "availability" | "lastUptime"> {
	@Required()
	@Enum(...prodAbilities)
	abilities: typeof prodAbilities[number][]

	@Required()
	@Property(FoldersModel)
	folders: FoldersModel
}

export class ProductionAgentModel extends AgentModel implements ProductionAgent {
	@Required()
	@Enum(...prodAbilities)
	abilities: typeof prodAbilities[number][]


	@Required()
	@Property(FoldersModel)
	folders: FoldersModel
}


export class ProductionApplications {
	@Required()
	@Property(ProductionAgentModel)
	agent: ProductionAgent

	@Required()
	@Property(String)
	apps: string[]

}
