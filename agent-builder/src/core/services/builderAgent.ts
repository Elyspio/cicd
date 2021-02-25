import {Apis} from "../apis";
import {BuildAgentModelAddAbilityEnum} from "../apis/manager";

export class BuilderAgentService {
    async init() {
        return Apis.manager.automation.automationAddBuildAgent({
            uri: "http://localhost:4001",
            ability: BuildAgentModelAddAbilityEnum.Docker
        })
    }
}
