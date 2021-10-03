import { AfterRoutesInit, Service } from "@tsed/common";
import { TypeORMService } from "@tsed/typeorm";
import { MongoRepository } from "typeorm";
import { getLogger } from "../../utils/logger";
import { Log } from "../../utils/decorators/logger";
import { MappingEntity } from "../entities/mappings.entity";

@Service()
export class MappingRepository implements AfterRoutesInit {
	private static log = getLogger.repository(MappingRepository);
	private repo!: { connection: MongoRepository<MappingEntity> };

	constructor(private typeORMService: TypeORMService) {}

	async $afterRoutesInit() {
		const connection = this.typeORMService.get("db")!; // get connection by name
		this.repo = {
			connection: connection.getMongoRepository(MappingEntity),
		};
	}

	@Log(MappingRepository.log)
	async add(user: Omit<MappingEntity, "_id">): Promise<MappingEntity> {
		return this.repo.connection.save(user);
	}

	async get(id: MappingEntity["id"]): Promise<MappingEntity | null> {
		const [mapping] = await this.repo.connection.find({
			where: {
				id,
			},
		});
		return mapping;
	}

	@Log(MappingRepository.log)
	async update<T extends keyof Omit<MappingEntity, "_id">>(data: Partial<MappingEntity> & Pick<MappingEntity, "id">) {
		const mapping = await this.get(data.id);
		if (!mapping) throw new Error(`MappingRepository-update: could not find mapping with id=${data.id}`);
		await this.repo.connection.update({ id: data.id }, data);
	}

	@Log(MappingRepository.log)
	async delete<T extends keyof Omit<MappingEntity, "_id">>(id: MappingEntity["id"]) {
		await this.repo.connection.deleteOne({ id });
	}

	async list<T extends keyof Omit<MappingEntity, "_id">>() {
		return this.repo.connection.find();
	}
}
