import {IQueue as Queue} from "../../utils/data.types";

export interface ProductionAgent extends Agent {
	abilities: ("docker" | "docker-compose")[]
	folders: {
		apps: string[]
	}
}


export interface BuildAgent extends Agent {
	abilities: ("docker" | "docker-buildx")[]
}

export interface Agent {
	uri: string,
	availability: "down" | "running" | "free",
	lastUptime: Date
}

interface Config {

}


export interface BuildConfig extends Config {
	github: {
		remote: string,
		branch: string,
		commit?: string
	},
	docker: {
		dockerfiles: {
			path: string,
			wd: string
			image: string
			tag?: string
		}[],
		username: string,
		platforms: string[]
	}
}

export interface DeployConfig extends Config, Pick<ProductionAgent, "uri"> {
	docker?: {
		compose?: {
			path: string
		}
	}
}

export type Timestamp = {
	createdAt: Date,
	startedAt: Date | null,
	finishedAt: Date | null
}
export type WithId<T> = T & { id: number }
//export type Job<T extends Config> = ConfigWithId<T> & Timestamp
export type Job<T extends Config> = WithId<Timestamp> & { config: T }

export interface HubConfig {
	// List of known agents
	agents: {
		production: ProductionAgent[],
		builder: BuildAgent[]
	},
	// Lists of jobs that will get processed once a agent is available
	queues: {
		builds: Queue<Job<BuildConfig>>
		deployments: Queue<Job<DeployConfig>>
	},
	// Running and finished jobs
	jobs: {
		builds: Job<BuildConfig>[],
		deployments: Job<DeployConfig>[]
	}
	// Mapping between a build (Github + docker image build) and a deployment
	mappings: {
		build: BuildConfig,
		deploy: DeployConfig,
		id: number
	}[]
}

type Modify<T, R> = Omit<T, keyof R> & R;


export type HubConfigExport = Modify<HubConfig, {
	queues: {
		builds: Array<Job<BuildConfig>>
		deployments: Array<Job<DeployConfig>>
	},
}>

