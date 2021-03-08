import {BodyParams, Controller, Post,} from "@tsed/common";
import {Name, Required, Returns} from "@tsed/schema";
import {Services} from "../../../core/services";
import {BuildConfigModel, DeployConfigModel} from "./model";

const examples: { build: BuildConfigModel } = {
    build: {
        docker: {
            dockerfiles: [{
                path: "Dockerfile",
                wd: ".",
                image: "automatize-github-docker",
                tag: "test"
            }],
            platforms: ["linux/amd64", "linux/arm64"],
            username: "elyspio"
        },
        github: {
            remote: "https://github.com/Elyspio/test.git",
            branch: "master"
        }
    }
}


@Controller("/automate/operation")
@Name("Operation")
export class AutomationController {


    @Post("/register")
    async register(
        @Required() @BodyParams("build", BuildConfigModel) build: BuildConfigModel,
        @Required() @BodyParams("deploy", DeployConfigModel) deploy: DeployConfigModel
    ) {
        await Services.manager.registerMapping({build, deploy})
    }


    @Post("/build")
    @Returns(204)
    async start(@Required() @BodyParams(BuildConfigModel) config: BuildConfigModel) {
        Services.manager.builder.askBuild(config);
    }

    @Post("/deployment")
    @Returns(204)
    async deploy(@Required() @BodyParams(DeployConfigModel) agent: DeployConfigModel) {
    }
}
