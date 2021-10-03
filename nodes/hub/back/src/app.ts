import "reflect-metadata";
import "@tsed/platform-express"; // /!\ keep this import
import "@tsed/socketio"; // import socket.io Ts.ED module
import "@tsed/swagger";
import { PlatformExpress } from "@tsed/platform-express";
import { Server } from "./web/server";
import { $log } from "@tsed/common";

if (require.main === module) {
	bootstrap();
}

async function bootstrap() {
	try {
		$log.debug("Start server...");
		const platform = await PlatformExpress.bootstrap(Server, {});

		await platform.listen();
		$log.debug("Server initialized");
	} catch (er) {
		$log.error(er);
	}
}
