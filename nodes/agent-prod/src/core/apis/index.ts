import { AutomationApi } from "./hub";
import { $log } from "@tsed/common";
import { RunnerApi } from "./runner";

export const hudServerUrl = process.env.HUD_SERVER_URL ?? "http://localhost:4000";
export const runnerUrl = process.env.RUNNER_SERVER_URL ?? "http://localhost:4002";
$log.info(`apis urls `, { hudServerUrl, runnerUrl });
export const Apis = {
	hub: {
		automation: new AutomationApi(undefined, hudServerUrl),
	},
	runner: new RunnerApi(undefined, runnerUrl),
};
