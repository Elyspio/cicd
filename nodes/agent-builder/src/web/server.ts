import { Configuration } from "@tsed/di";
import { PlatformApplication } from "@tsed/common";
import { middlewares } from "./middleware/common/raw";
import "@tsed/platform-express"; // /!\ keep this import
import "@tsed/swagger";
import { webConfig } from "../config/web";

@Configuration(webConfig)
export class Server {
	@Configuration()
	settings: Configuration;

	constructor(private app: PlatformApplication) {
	}

	$beforeRoutesInit() {
		this.app.use(...middlewares);
		return null;
	}
}
