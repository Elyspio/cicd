import {Apis, managerServerUrl} from "../../apis";
import {BuildAgentModelAdd} from "../../apis/manager";
import {BuildConfig, ConfigWithId} from "../../../../../manager/back/src/core/services/manager/types";
import {Services} from "../index";
import {files} from "../storage";
import {$log} from "@tsed/common";
import {intervalBetweenKeepAlive, intervalBetweenRegister} from "../../../config/agent";
import {promises} from "fs"

const {rm} = promises;


export class BuilderAgentService {

    private buildNum = 1

    async getConfig() {
        return Services.storage.read<BuildAgentModelAdd>(files.conf);
    }

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
        setInterval(() => this.register(), intervalBetweenRegister)
        setInterval(() => this.keepAlive(), intervalBetweenKeepAlive)
        await this.register();
    }

    /**
     * Build a docker image from a repository and a dockerfile config
     * At the end of the built image is pushed to repository
     */
    async build(config: ConfigWithId<BuildConfig>) {
        const p = await Services.git.initFolder(config)
        this.buildNum++;
        const strs = await Services.docker.buildAndPush(config, p);
        try {
            await rm(p, {recursive: true, force: true});
        } catch (e) {

        }
        return strs;
    }
}
