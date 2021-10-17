import { AfterRoutesInit, BeforeListen, Service } from "@tsed/common";
import { TypeORMService } from "@tsed/typeorm";
import { MongoRepository } from "typeorm";
import { QueuesEntity } from "../entities/queues.entity";
import { getLogger } from "../../utils/logger";
import { Log } from "../../utils/decorators/logger";
import { BuildConfig, DeployConfig } from "../entities/common/entities";
import { Mutex } from "async-mutex";

@Service()
export class QueueRepository implements AfterRoutesInit, BeforeListen {
	private static log = getLogger.repository(QueueRepository);
	private repo!: { connection: MongoRepository<QueuesEntity> };
	private lock = new Mutex();

	constructor(private typeORMService: TypeORMService) {}

	async $beforeListen() {
		if ((await this.get()) === null) {
			await this.create({ builds: [], deployments: [] });
		}
	}

	async $afterRoutesInit() {
		const connection = this.typeORMService.get("db")!; // get connection by name
		this.repo = {
			connection: connection.getMongoRepository(QueuesEntity),
		};
	}

	@Log(QueueRepository.log)
	async create(user: Omit<QueuesEntity, "_id">): Promise<QueuesEntity> {
		return this.repo.connection.save(user);
	}

	async get(): Promise<QueuesEntity | null> {
		const [jobs] = await this.repo.connection.find();
		return jobs ?? null;
	}

	@Log(QueueRepository.log)
	async enqueue<T extends keyof Omit<QueuesEntity, "_id">>(type: T, data: Omit<QueuesEntity[T][number], "createdAt" | "finishedAt" | "startedAt" | "stdout" | "error">) {
		await this.lock.runExclusive(async () => {
			const all = (await this.get())!;
			if (type === "deployments") {
				all.deployments.push({
					...data,
					config: data.config as DeployConfig,
					createdAt: new Date(),
					finishedAt: null,
					startedAt: null,
					stdout: null,
					error: null,
				});
			}
			if (type === "builds") {
				all.builds.push({
					...data,
					config: data.config as BuildConfig,
					createdAt: new Date(),
					finishedAt: null,
					startedAt: null,
					stdout: null,
					error: null,
				});
			}
			await this.repo.connection.save(all);
		});
	}

	@Log(QueueRepository.log)
	async update<T extends keyof Omit<QueuesEntity, "_id">>(type: T, data: Partial<QueuesEntity[T][number]> & Pick<QueuesEntity[T][number], "id">) {
		return this.lock.runExclusive(async () => {
			const all = (await this.get())!;
			const index = all[type].findIndex((e) => e.id === data.id);
			if (index === -1) throw new Error(`QueueRepository-update: could not find job in ${type} with id=${data.id}`);
			all[type][index] = { ...all[type][index], ...data };
			await this.repo.connection.save(all);
			return all[type][index];
		});
	}

	@Log(QueueRepository.log)
	async delete<T extends keyof Omit<QueuesEntity, "_id">>(type: T, id: QueuesEntity[T][number]["id"]) {
		await this.lock.runExclusive(async () => {
			const all = (await this.get())!;
			const index = all[type].findIndex((e) => e.id === id);
			if (index === -1) throw new Error(`QueueRepository-delete: could not find job in ${type} with id=${id}`);
			all[type].splice(index, 1);
			await this.repo.connection.save(all);
		});
	}

	async list<T extends keyof Omit<QueuesEntity, "_id">>(type: T) {
		const all = (await this.get())!;
		return all[type];
	}
}
