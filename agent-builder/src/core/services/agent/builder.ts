import {Apis} from "../../apis";
import {BuildAgentModelAddAbilityEnum} from "../../apis/manager";
import {BuildConfig} from "../../../../../manager/back/src/core/services/manager/types";
import {Services} from "../index";
import {files} from "../storage";

import * as path from "path";
import {exec} from "child_process";
import {$log} from "@tsed/common";

export class BuilderAgentService {

    private buildNum = 1

    async init() {
        const agent = {
            uri: "http://localhost:4001",
            ability: BuildAgentModelAddAbilityEnum.Docker
        };
        await Services.storage.store(files.conf, agent);
        await Apis.manager.automation.automationAddBuildAgent(agent)

        setInterval(() => {
            Apis.manager.automation.automationBuilderAgentKeepAlive({url: agent.uri})
        }, 2500)

    }

    /**
     * Build a docker image from a repository and a dockerfile config
     * At the end of the build this one is pushed to repository
     * @param docker
     * @param github
     */
    async build({docker, github}: BuildConfig) {
        const p = await Services.git.initFolder(github)
        this.buildNum++;
        return await Services.docker.buildAndPush(p, docker);
    }
}
