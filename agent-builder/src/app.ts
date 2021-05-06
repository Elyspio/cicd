import {$log} from "@tsed/common";
import {PlatformExpress} from "@tsed/platform-express";
import {Server} from "./web/server";
import {Services} from "./core/services";

if (require.main === module) {
	bootstrap()
}


async function bootstrap() {
	try {
		$log.debug("Start server...");
		const platform = await PlatformExpress.bootstrap(Server, {});
		await platform.listen();
		$log.debug("Server initialized");
		await Services.agent.init();
	} catch (er) {
		$log.error(er);
	}
}
