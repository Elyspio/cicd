import { Column, Entity, ObjectID, ObjectIdColumn } from "typeorm";
import { JobBuildEntity, JobDeploymentEntity } from "./common/entities";
import { HubConfigExport } from "../../services/hub/types";

type A = HubConfigExport["queues"];

@Entity("Queues")
export class QueuesEntity implements A {
	@ObjectIdColumn()
	_id!: ObjectID;
	@Column({ array: true })
	public builds: JobBuildEntity[];
	@Column({ array: true })
	public deployments: JobDeploymentEntity[];
}
