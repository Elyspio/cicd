import {Apis, managerServerUrl} from "../../apis";
import {BuildAgentModelAdd} from "../../apis/manager";
import {BuildConfig} from "../../../../../manager/back/src/core/services/manager/types";
import {Services} from "../index";
import {files} from "../storage";
import {$log} from "@tsed/common";
import {intervalBetweenKeepAlive, intervalBetweenRegister} from "../../../config/agent";

export class BuilderAgentService {

    async getConfig() {
        return Services.storage.read<BuildAgentModelAdd>(files.conf);
    }

    private buildNum = 1

    async register() {
        const config = await this.getConfig();
        $log.info(`Registering to ${managerServerUrl}`, config)
        await Apis.manager.automation.automationAddBuildAgent(config)
    }

    async keepAlive() {
        $log.info(`Sending keep alive to ${managerServerUrl}`)
        await Apis.manager.automation.automationBuilderAgentKeepAlive({url: (await this.getConfig()).uri})
    }


    async init() {
        await this.register()
        setInterval(() => this.register(), intervalBetweenRegister)
        setInterval(() => this.keepAlive(), intervalBetweenKeepAlive)
    }

    /**
     * Build a docker image from a repository and a dockerfile config
     * At the end of the builded image is pushed to repository
     * @param docker
     * @param github
     */
    async build({docker, github}: BuildConfig) {
        const p = await Services.git.initFolder(github)
        this.buildNum++;
        return await Services.docker.buildAndPush(p, docker);
    }
}
