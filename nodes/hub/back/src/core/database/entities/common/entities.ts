import {
	BakeBuild,
	BuildConfig as IBuildConfig,
	DeployConfig as IDeployConfig,
	Dockerfiles,
	Job as IJob,
	ProductionAgentModelAddAbilities as IProductionAgentModelAddAbilities,
	ProductionAgentModelAddAbilitiesDockerCompose as IProductionAgentModelAddAbilitiesDockerCompose,
} from "../../../services/hub/types";
import { Column } from "typeorm";

// region job

class Job implements Omit<IJob, "config"> {
	@Column()
	public createdAt: Date;
	@Column({ nullable: true })
	public finishedAt: Date | null;
	@Column()
	public id: number;
	@Column({ nullable: true })
	public startedAt: Date | null;
	@Column({ nullable: true })
	public stdout: string | null;
}

type A = IBuildConfig["github"];

class BuildGithubConfig implements A {
	@Column()
	public branch: string;
	@Column()
	public commit?: string;
	@Column()
	public remote: string;
}

type B = Dockerfiles["files"][number];

class BuildDockerfileFileConfig implements B {
	@Column()
	public image: string;
	@Column()
	public path: string;
	@Column({ nullable: true })
	public tag?: string;
	@Column()
	public wd: string;
}

class BuildDockerfileConfig implements Dockerfiles {
	@Column({ array: true })
	public files: BuildDockerfileFileConfig[];
	@Column({ array: true })
	public platforms: string[];
	@Column()
	public username: string;
}

class BuildBakeConfig implements BakeBuild {
	@Column()
	public bakeFilePath: string;
}

export class BuildConfig implements IBuildConfig {
	@Column({ nullable: true })
	public bake?: BuildBakeConfig;

	@Column({ nullable: true })
	public dockerfiles?: BuildDockerfileConfig;

	@Column()
	public github: BuildGithubConfig;
}

export class JobBuildEntity extends Job implements IJob<IBuildConfig> {
	@Column()
	public config: BuildConfig;
}

class DeployDockerComposeConfig {
	@Column()
	path: string;
}

class DeployDockerConfig {
	@Column({ nullable: true })
	compose?: DeployDockerComposeConfig;
}

export class DeployConfig implements IDeployConfig {
	@Column({ nullable: true })
	public docker?: DeployDockerConfig;
	@Column()
	public uri: string;
}

export class JobDeploymentEntity extends Job implements IJob<IDeployConfig> {
	@Column()
	public config: DeployConfig;
}

// endregion job

class ProductionAgentModelAddAbilitiesDockerCompose implements IProductionAgentModelAddAbilitiesDockerCompose {
	@Column()
	isDockerComposeIntegratedToCli: boolean;
}

export class ProductionAgentModelAddAbilities implements IProductionAgentModelAddAbilities {
	@Column({ enum: ["docker", "docker-compose"] })
	type: "docker" | "docker-compose";
	@Column({ nullable: true })
	dockerCompose?: ProductionAgentModelAddAbilitiesDockerCompose;
}
