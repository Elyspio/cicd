import { AfterRoutesInit, BeforeListen, Service } from "@tsed/common";
import { TypeORMService } from "@tsed/typeorm";
import { MongoRepository } from "typeorm";
import { JobsEntity } from "../entities/jobs.entity";
import { getLogger } from "../../utils/logger";
import { Log } from "../../utils/decorators/logger";
import { BuildConfig, DeployConfig } from "../entities/common/entities";

@Service()
export class JobRepository implements AfterRoutesInit, BeforeListen {
	private static log = getLogger.repository(JobRepository);
	private repo!: { connection: MongoRepository<JobsEntity> };

	constructor(private typeORMService: TypeORMService) {}

	async $afterRoutesInit() {
		const connection = this.typeORMService.get("db")!; // get connection by name
		this.repo = {
			connection: connection.getMongoRepository(JobsEntity),
		};
	}

	async $beforeListen() {
		if ((await this.get()) === null) {
			await this.create({ builds: [], deployments: [] });
		}
	}

	@Log(JobRepository.log)
	async create(user: Omit<JobsEntity, "_id">): Promise<JobsEntity> {
		return this.repo.connection.save(user);
	}

	async get(): Promise<JobsEntity | null> {
		const [jobs] = await this.repo.connection.find();
		return jobs ?? null;
	}

	@Log(JobRepository.log)
	async add<T extends keyof Omit<JobsEntity, "_id">>(type: T, data: JobsEntity[T][number]) {
		const all = (await this.get())!;
		if (type === "deployments") {
			all.deployments.push({
				...data,
				config: data.config as DeployConfig,
			});
		}
		if (type === "builds") {
			all.builds.push({
				...data,
				config: data.config as BuildConfig,
			});
		}
		await this.repo.connection.save(all);
	}

	@Log(JobRepository.log)
	async update<T extends keyof Omit<JobsEntity, "_id">>(type: T, data: Partial<JobsEntity[T][number]> & Pick<JobsEntity[T][number], "id">) {
		const all = (await this.get())!;
		const index = all[type].findIndex((e) => e.id === data.id);
		if (index === -1) throw new Error(`JobRepository-update: could not find job in ${type} with id=${data.id}`);
		all[type][index] = { ...all[type][index], ...data };
		await this.repo.connection.save(all);
		return all[type][index];
	}

	async delete<T extends keyof Omit<JobsEntity, "_id">>(type: T, id: JobsEntity[T][number]["id"]) {
		const all = (await this.get())!;
		const index = all[type].findIndex((e) => e.id === id);
		if (index === -1) throw new Error(`JobRepository-update: could not find job in ${type} with id=${id}`);
		all[type].splice(index, 1);
		await this.repo.connection.save(all);
	}

	async list<T extends keyof Omit<JobsEntity, "_id">>(type: T) {
		const all = (await this.get())!;
		return all[type];
	}

	async addStdout<T extends keyof Omit<JobsEntity, "_id">>(type: T, id: JobsEntity[T][number]["id"], stdout: string) {
		const all = (await this.get())!;
		const index = all[type].findIndex((e) => e.id === id);
		if (index === -1) throw new Error(`JobRepository-update: could not find job in ${type} with id=${id}`);
		if (all[type][index].stdout === null) all[type][index].stdout = stdout;
		else all[type][index].stdout += stdout;
		await this.repo.connection.save(all);
	}
}
