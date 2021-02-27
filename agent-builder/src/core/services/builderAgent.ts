import {Apis} from "../apis";
import {BuildAgentModelAddAbilityEnum} from "../apis/manager";

export class BuilderAgentService {
    async init() {
        const agent = {
            uri: "http://localhost:4001",
            ability: BuildAgentModelAddAbilityEnum.Docker
        };
        await Apis.manager.automation.automationAddBuildAgent(agent)

        setInterval(() => {
            Apis.manager.automation.automationBuilderAgentKeepAlive({url: agent.uri})
        }, 2500)

    }
}
