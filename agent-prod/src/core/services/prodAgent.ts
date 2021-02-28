import {Apis} from "../apis";
import * as  path from "path";

export class BuilderAgentService {
    async init() {
        await Apis.manager.automation.automationAddProductionAgent({
            uri: "http://localhost:4002",
            docker: {
                compose: [{
                    path: path.resolve(__dirname, "..", "..")
                }],
            }
        })

        setInterval(() => {
            Apis.manager.automation.automationProductionAgentKeepAlive({url: "http://localhost:4002"})
        }, 2500)

    }
}
