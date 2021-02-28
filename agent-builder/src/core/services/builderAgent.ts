import {Apis} from "../apis";
import {BuildAgentModelAddAbilityEnum} from "../apis/manager";
import {BuildConfig} from "../../../../manager/back/src/core/services/manager/types";
import {Services} from "./index";
import {files} from "./storage";

export class BuilderAgentService {
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

    async build(conf: BuildConfig) {
    }

}
