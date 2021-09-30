import { $log } from "@tsed/common";
import { PlatformExpress } from "@tsed/platform-express";
import { Server } from "./web/server";
import { initSocket } from "./core/services/agent/socket";

if (require.main === module) {
	bootstrap();
}

async function bootstrap() {
	try {
		$log.debug("Start server...");
		const platform = await PlatformExpress.bootstrap(Server, {});
		await platform.listen();
		initSocket();
		$log.debug("Server initialized");
	} catch (er) {
		$log.error(er);
	}
}
