import { Configuration, Inject } from "@tsed/di";
import { $log, AfterRoutesInit, BeforeRoutesInit, PlatformApplication } from "@tsed/common";
import { Response } from "express";
import { middlewares } from "./middleware/common/raw";
import { rootDir, webConfig } from "../config/web";
import * as path from "path";
import { databaseConfig } from "../config/db";

const frontPath = process.env.FRONT_PATH ?? path.resolve(rootDir, "..", "..", "..", "front", "build");

$log.name = process.env.APP_NAME ?? "Automatize -- hub";

@Configuration({ ...webConfig, typeorm: databaseConfig })
export class Server implements BeforeRoutesInit, AfterRoutesInit {
	@Inject()
	app: PlatformApplication;

	@Configuration()
	settings: Configuration;

	$beforeRoutesInit() {
		this.app.use(...middlewares);
	}

	$afterRoutesInit() {
		this.app.use("*", (req, res: Response) => {
			res.sendFile(path.join(frontPath, "index.html"));
		});
	}
}
