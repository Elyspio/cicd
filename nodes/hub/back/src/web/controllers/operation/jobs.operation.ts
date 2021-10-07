import { Controller, Delete, PathParams } from "@tsed/common";
import { Enum, Name, Returns } from "@tsed/schema";
import { JobBuild } from "../../../core/services/hub/job/build";
import { JobDeployment } from "../../../core/services/hub/job/deployment";
import { Job } from "../../../core/services/hub/types";

@Controller("/operations/jobs")
@Name("Operation.Jobs")
export class JobsOperationController {
	private services: {
		builds: JobBuild;
		deployments: JobDeployment;
	};

	constructor(agentBuild: JobBuild, agentProduction: JobDeployment) {
		this.services = {
			builds: agentBuild,
			deployments: agentProduction,
		};
	}

	@Delete("/:type/:id")
	@Returns(204)
	async delete(@PathParams("id", Number) id: Job["id"], @Enum("build", "deployment") @PathParams("type") type: "build" | "deployment") {
		let func = type === "build" ? this.services.builds.delete : this.services.deployments.delete;
		func = func.bind(type === "build" ? this.services.builds : this.services.deployments);
		await func(id);
	}
}
