import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";
import { JobBuildEntity, JobDeploymentEntity } from "./common/entities";
import { HubConfig } from "../../services/hub/types";

type A = HubConfig["jobs"];

@Entity("Jobs")
export class JobsEntity implements A {
	@ObjectIdColumn()
	_id!: ObjectID;
	@Column({ array: true })
	public builds: JobBuildEntity[];
	@Column({ array: true })
	public deployments: JobDeploymentEntity[];
}
