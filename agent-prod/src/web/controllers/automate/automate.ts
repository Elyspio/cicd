import {Controller, Get, Post,} from "@tsed/common";
import {Description, Name, Returns} from "@tsed/schema";
import {Services} from "../../../core/services";
import {files} from "../../../core/services/storage";
import {ProductionAgentModelAdd} from "../../../core/apis/manager";


@Controller("/automate")
@Name("Automate")
export class AutomationController {

    @Get("/apps")
    @Description("Fetch the list of docker-compose.yml files")
    @Returns(200, Array).Of(String)
    async getApps() {
        const conf = await Services.storage.read<ProductionAgentModelAdd>(files.conf)
        return Services.docker.compose.list(conf.folders.apps)
    }

}
