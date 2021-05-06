import {AutomationApi} from "./manager";
import {AuthenticationApi} from "./authentication";
import {$log} from "@tsed/common";


export const managerServerUrl = process.env.MANAGER_SERVER_URL ?? "http://localhost:4000";
$log.info("Manager server url " + managerServerUrl);
export const Apis = {
	manager: {
		automation: new AutomationApi(undefined, managerServerUrl)
	},
	authentication: new AuthenticationApi(undefined, "https://elyspio.fr/authentication")

}
