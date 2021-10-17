import { AfterRoutesInit, BeforeListen, Service } from "@tsed/common";
import { TypeORMService } from "@tsed/typeorm";
import { MongoRepository } from "typeorm";
import { getLogger } from "../../utils/logger";
import { Log } from "../../utils/decorators/logger";
import { AgentsEntity } from "../entities/agents.entity";
import { BuildAgent, DeployAgent } from "../../services/hub/types";

@Service()
export class AgentRepository implements AfterRoutesInit, BeforeListen {
	private static log = getLogger.repository(AgentRepository);
	private repo!: { connection: MongoRepository<AgentsEntity> };

	constructor(private typeORMService: TypeORMService) {}

	async $afterRoutesInit() {
		const connection = this.typeORMService.get("db")!; // get connection by name
		this.repo = {
			connection: connection.getMongoRepository(AgentsEntity),
		};
	}

	async $beforeListen() {
		const all = await this.get();
		if (all === null) {
			await this.create({ builds: [], deployments: [] });
		} else {
			all.builds = [];
			all.deployments = [];
			await this.repo.connection.save(all);
		}
	}

	@Log(AgentRepository.log)
	async create(user: Omit<AgentsEntity, "_id">): Promise<AgentsEntity> {
		return this.repo.connection.save(user);
	}

	async get(): Promise<AgentsEntity | null> {
		const [jobs] = await this.repo.connection.find();
		return jobs ?? null;
	}

	@Log(AgentRepository.log)
	async add<T extends keyof Omit<AgentsEntity, "_id">>(type: T, data: Omit<AgentsEntity[T][number], "availability" | "lastUptime">) {
		const all = (await this.get())!;
		if (type === "deployments") {
			all.deployments = [...all.deployments.filter((agent) => agent.uri !== data.uri), { ...(data as DeployAgent), lastUptime: new Date(), availability: "free" }];
		}
		if (type === "builds") {
			all.builds = [...all.builds.filter((agent) => agent.uri !== data.uri), { ...(data as BuildAgent), lastUptime: new Date(), availability: "free" }];
		}
		await this.repo.connection.save(all);
	}

	@Log(AgentRepository.log)
	async update<T extends keyof Omit<AgentsEntity, "_id">>(type: T, data: Partial<AgentsEntity[T][number]> & Pick<AgentsEntity[T][number], "uri">) {
		const all = (await this.get())!;
		const index = all[type].findIndex((e) => e.uri === data.uri);
		if (index === -1) throw new Error(`AgentRepository-update: could not find agent in with uri=${data.uri} and type=${type}`);
		all[type][index] = { ...all[type][index], ...data };
		await this.repo.connection.save(all);
		return all[type][index];
	}

	@Log(AgentRepository.log)
	async delete<T extends keyof Omit<AgentsEntity, "_id">>(type: T, uri: AgentsEntity[T][number]["uri"]) {
		const all = (await this.get())!;
		const index = all[type].findIndex((e) => e.uri === uri);
		if (index === -1) throw new Error(`AgentRepository-delete: could not find agent in with uri=${uri} and type=${type}`);
		all[type].splice(index, 1);
		await this.repo.connection.save(all);
	}

	async list<T extends keyof Omit<AgentsEntity, "_id">>(type: T) {
		const all = (await this.get())!;
		return all[type];
	}
}
