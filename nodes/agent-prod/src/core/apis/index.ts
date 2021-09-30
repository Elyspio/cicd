import { AutomationApi } from "./hub";
import { AuthenticationApi } from "./authentication";
import { $log } from "@tsed/common";

export const hudServerUrl = process.env.HUD_SERVER_URL ?? "http://localhost:4000";
$log.info("hub server url " + hudServerUrl);
export const Apis = {
	hub: {
		automation: new AutomationApi(undefined, hudServerUrl),
	},
	authentication: new AuthenticationApi(undefined, "https://elyspio.fr/authentication"),
};
