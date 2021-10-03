import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";
import { Agent as IAgent, BuildAgent as IBuildAgent, DeployAgent as IDeployAgent, HubConfig } from "../../services/hub/types";
import { ProductionAgentModelAddAbilities } from "./common/entities";

type A = HubConfig["agents"];

class Agent implements IAgent {
	@Column({ enum: ["down", "running", "free"] })
	public availability: "down" | "running" | "free";
	@Column()
	public lastUptime: Date;
	@Column()
	public uri: string;
}

class BuildAgent extends Agent implements IBuildAgent {
	@Column({ enum: ["docker", "docker-buildx"], array: true })
	public abilities: ("docker" | "docker-buildx")[];
}

type X = IDeployAgent["folders"];

class DeployAgentFolders implements X {
	@Column({ array: true })
	public apps: string[];
}

class DeployAgent extends Agent implements IDeployAgent {
	@Column({ array: true })
	public abilities: ProductionAgentModelAddAbilities[];
	@Column()
	public folders: DeployAgentFolders;
}

@Entity("Agents")
export class AgentsEntity implements A {
	@ObjectIdColumn()
	_id!: ObjectID;
	@Column({ array: true })
	public builds: BuildAgent[];
	@Column({ array: true })
	public deployments: DeployAgent[];
}
