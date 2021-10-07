import { BodyParams, Controller, Delete, Get, PathParams, Post } from "@tsed/common";
import { Description, Name, Required, Returns } from "@tsed/schema";
import { Mappings } from "../../../core/services/hub/mapping/mappings";
import { BuildConfigModel, DeployConfigModel, MappingModel } from "../automate/model";
import { AgentBuild } from "../../../core/services/hub/agent/builder";
import { AgentDeployment } from "../../../core/services/hub/agent/production";
import { NotFound } from "@tsed/exceptions";

@Controller("/operations/mappings")
@Name("Operation.Mappings")
export class MappingsOperationController {
	private services: { deployments: AgentDeployment; mappings: Mappings; builds: AgentBuild };

	constructor(agentBuild: AgentBuild, agentProd: AgentDeployment, mappings: Mappings) {
		this.services = {
			builds: agentBuild,
			deployments: agentProd,
			mappings,
		};
	}

	@Post("/")
	@Description("Add a new mapping")
	@Returns(201, Number)
	async add(
		@Required() @BodyParams("build", BuildConfigModel) build: BuildConfigModel,
		@Required()
		@BodyParams("deploy", DeployConfigModel)
		deploy: DeployConfigModel
	) {
		return await this.services.mappings.add({ build, deploy });
	}

	@Get("/")
	@Description("Get all mappings")
	@(Returns(200, Array).Of(MappingModel))
	get() {
		return this.services.mappings.list();
	}

	@Delete("/:id")
	@Description("Delete a mapping from its id")
	@Returns(204)
	delete(@Description("Mapping id") @PathParams("id", Number) id: MappingModel["id"]) {
		return this.services.mappings.delete(id);
	}

	@Post("/:id")
	@Returns(204)
	@Returns(NotFound.STATUS, NotFound)
	@Description("Run a mapping from its id")
	async run(@PathParams("id", Number) id: MappingModel["id"]) {
		const mapping = await this.services.mappings.get(id);
		if (!mapping) throw new NotFound(`Could not find a mapping with id=${id}`);
		const idBuild = await this.services.builds.askBuild(mapping.build);
		await this.services.builds.waitForJob(idBuild);
		const idProd = await this.services.deployments.askDeploy(mapping.deploy);
		await this.services.deployments.waitForJob(idProd);
	}
}
