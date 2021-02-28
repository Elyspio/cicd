import {BodyParams, Controller, Get, Post, } from "@tsed/common";
import {Example, Name, Required, Returns} from "@tsed/schema";
import {Services} from "../../../core/services";
import {BuildAgentModelAdd, BuildAgentModelReturn, ProductionAgentModel} from "../automate/models";
import {BuildConfigModel} from "./model";

const examples: {build: BuildConfigModel} = {
    build: {
        docker: {
            dockerfiles: [{
                path: "/Dockerfile",
                wd: "/",
                image: "automatize-github-docker",
                tag: "test"
            }]
       },
        github: {
            remote: "https://github.com/Elyspio/test.git",
            branch: "main"
        }
    }
}


@Controller("/automate/operation")
@Name("Operation")
export class AutomationController {

    @Post("/build")
    @Returns(204)
    async start(@Required() @BodyParams(BuildConfigModel) config: BuildConfigModel) {
        Services.manager.builder.askBuild(config);
    }

    @Post("/deployment")
    @Returns(204)
    async deploy(@Required() @BodyParams(BuildAgentModelAdd) agent: BuildAgentModelAdd) {
        Services.manager.builder.add(agent)
    }
}
