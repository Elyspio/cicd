import { Controller, Get, QueryParams } from "@tsed/common";
import { Returns } from "@tsed/schema";
import { GetDockerFileModel } from "./models";
import { Inject } from "@tsed/di";
import { DockerService } from "../../../core/services/docker/docker";

@Controller("/docker")
export class DockerController {
	@Inject()
	dockerService: DockerService;

	@Get("/dockerfiles")
	@Returns(200, String)
	async get(@QueryParams(GetDockerFileModel) params: GetDockerFileModel) {
		return this.dockerService.getDockerFile(params.preset);
	}
}
