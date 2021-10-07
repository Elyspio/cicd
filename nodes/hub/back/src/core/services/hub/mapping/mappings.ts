import { Mapping } from "../types";
import { Log } from "../../../utils/decorators/logger";
import { getLogger } from "../../../utils/logger";

import { OnReady, Service } from "@tsed/common";
import { MappingRepository } from "../../../database/repositories/mapping.repository";

export interface MappingMethods {
	add: (agent: Omit<Mapping, "id">) => void;
	delete: (id: Mapping["id"]) => void;
	update: (id: Mapping["id"], data: Partial<Mapping>) => Promise<Mapping>;
	get: (id: Mapping["id"]) => Promise<Mapping | undefined>;
	list: () => Promise<Mapping[]>;
}

@Service()
export class Mappings implements MappingMethods, OnReady {
	private static log = getLogger.service(Mappings);

	private mappingNextId: number;
	private repositories: { mappings: MappingRepository };

	constructor(mappingRepository: MappingRepository) {
		this.repositories = {
			mappings: mappingRepository,
		};
	}

	async $onReady(): Promise<any> {
		this.mappingNextId =
			(await this.repositories.mappings.list()).reduce((acc, mapping) => {
				if (mapping.id > acc) return mapping.id;
				return acc;
			}, 0) + 1;
	}

	@Log(Mappings.log)
	async add(mapping: Omit<Mapping, "id">) {
		const id = ++this.mappingNextId;
		await this.repositories.mappings.add({
			...mapping,
			id,
		});
		return id;
	}

	@Log(Mappings.log)
	async delete(id: number) {
		await this.repositories.mappings.delete(id);
	}

	@Log(Mappings.log)
	async update(id: number, data: Partial<Mapping>) {
		await this.repositories.mappings.update({ ...data, id });
		return (await this.get(id))!;
	}

	@Log(Mappings.log)
	async get(id: number) {
		return (await this.repositories.mappings.get(id)) ?? undefined;
	}

	@Log(Mappings.log)
	list() {
		return this.repositories.mappings.list();
	}
}
