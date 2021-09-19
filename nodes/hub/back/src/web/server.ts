import {Configuration, Inject} from "@tsed/di";
import {$log, BeforeRoutesInit, PlatformApplication} from "@tsed/common";
import {middlewares} from "./middleware/common/raw";
import {webConfig} from "../config/web";
import * as path from "path";

$log.name = process.env.APP_NAME ?? "Automatize -- hub"

$log.appenders.set("everything", {
	type: 'file',
	filename: path.resolve((process.env.LOG_FOLDER ?? `${__dirname}/../../logs`), "app.log"),
	pattern: '.yyyy-MM-dd',
	maxLogSize: 10485760,
	backups: 3,
	compress: true
});

@Configuration(webConfig)
export class Server implements BeforeRoutesInit {

	@Inject()
	app: PlatformApplication;

	@Configuration()
	settings: Configuration;

	$beforeRoutesInit() {
		this.app.use(...middlewares)
	}
}
