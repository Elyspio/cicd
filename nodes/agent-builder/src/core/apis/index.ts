import {AutomationApi} from "./hub";
import {AuthenticationApi} from "./authentication";
import {Helper} from "../utils/helper";


export const hudServerUrl = Helper.removeTrallingSlash(process.env.HUD_SERVER_URL ?? "http://localhost:4000");
export const authenticationServerUrl = Helper.removeTrallingSlash(process.env.AUTHENTICATION_SERVER_URL ?? "http://localhost:4001");


export const Apis = {
	hub: {
		automation: new AutomationApi(undefined, hudServerUrl)
	},
	authentication: new AuthenticationApi(undefined, authenticationServerUrl)

}
