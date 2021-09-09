import {Description, Property, Required} from "@tsed/schema";
import {DeployConfig, Job, Timestamp} from "../../../../../hub/back/src/core/services/hub/types";


class JobModel {
	@Required()
	@Description("Job id")
	id: number
}


export class DockerComposeField {
	@Property()
	@Description("Path where the docker-compose.yml file is")
	path: string;
}

export class DockerField {
	@Property(DockerComposeField)
	compose?: DockerComposeField
}

export class DeployConfigModel {
	@Property(DockerField)
	@Description("Docker/Docker-Compose configuration")
	@Required()
	docker: DockerField

	@Property()
	@Required()
	@Description("URI of the production agent")
	uri: string;
}

export class DeployJobModel extends JobModel implements Omit<Job<DeployConfig>, keyof Timestamp> {
	@Property(DeployConfigModel)
	config: DeployConfigModel
}



