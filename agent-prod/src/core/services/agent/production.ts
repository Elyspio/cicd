import {Apis, managerServerUrl} from "../../apis";
import {BuildAgentModelAdd} from "../../apis/manager";
import {DeployConfig} from "../../../../../manager/back/src/core/services/manager/types";
import {Services} from "../index";
import {files} from "../storage";
import {$log} from "@tsed/common";
import {intervalBetweenKeepAlive, intervalBetweenRegister} from "../../../config/agent";
import {promises} from "fs"

const {rm} = promises;


export class ProductionAgentService {

    private deployNum = 1

    async getConfig() {
        return Services.storage.read<BuildAgentModelAdd>(files.conf);
    }

    async register() {
        const config = await this.getConfig();
        $log.info(`Registering to ${managerServerUrl}`, config)
        await Apis.manager.automation.automationAddProductionAgent(config)
    }

    async keepAlive() {
        $log.info(`Sending keep alive to ${managerServerUrl}`)
        await Apis.manager.automation.automationProductionAgentKeepAlive({url: (await this.getConfig()).uri})
    }


    async init() {
        await this.register()
        setInterval(() => this.register(), intervalBetweenRegister)
        setInterval(() => this.keepAlive(), intervalBetweenKeepAlive)
    }

    /**
     * Deploy a docker-compose configuration
     */
    async deploy(conf: DeployConfig) {
        if (conf?.docker?.compose?.path) {
            await Services.docker.compose.pull(conf.docker.compose.path)
            await Services.docker.compose.up(conf.docker.compose.path)

        }
    }
}
