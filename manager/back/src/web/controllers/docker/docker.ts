import {Controller, Get, QueryParams} from "@tsed/common";
import {Returns} from "@tsed/schema";
import {GetDockerFileModel} from "./models";
import {Services} from "../../../core/services";

@Controller("/docker")
export class DockerController {
    @Get("/dockerfiles")
    @Returns(200, String)
    async get(@QueryParams(GetDockerFileModel) params: GetDockerFileModel) {
        return Services.docker.getDockerFile(params.preset)
    }
}
