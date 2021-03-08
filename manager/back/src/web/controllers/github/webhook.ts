import {BodyParams, Controller, Post} from "@tsed/common";
import {Name, Required, Returns} from "@tsed/schema";
import {GithubPushWebhook} from "./models";
import {Services} from "../../../core/services";


@Controller("/github/webhook")
@Name("Github Webhooks")
export class GithubWebhooks {
    @Post("/push")
    @Returns(204)
    async push(@Required() @BodyParams(GithubPushWebhook) event: GithubPushWebhook) {
        if (event.ref.includes("refs/heads/")) {
            const branch = event.ref.slice(event.ref.lastIndexOf("/") + 1)
            const push = Services.manager.config.mappings.find(({build}) => build.github.remote === event.repository.url && build.github.branch === branch)
            if (push) {
                Services.manager.builder.askBuild(push.build);
                Services.manager.production.askDeploy(push.deploy);
            }
        }
    }
}
