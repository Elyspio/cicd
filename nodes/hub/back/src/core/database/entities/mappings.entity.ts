import { HubConfigExport } from "../../services/hub/types";
import { Column, Entity, ObjectIdColumn } from "typeorm";
import { BuildConfig, DeployConfig } from "./common/entities";

type A = HubConfigExport["mappings"][number];

@Entity("Mapping")
export class MappingEntity implements A {
	@Column()
	public build: BuildConfig;
	@Column()
	public deploy: DeployConfig;
	@ObjectIdColumn()
	public _id: number;
	@Column()
	public id: A["id"];
}
