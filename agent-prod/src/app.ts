import {$log} from "@tsed/common";
import "@tsed/platform-express"; // /!\ keep this import
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
        Services.agent.init();
        await platform.listen();
        $log.debug("Server initialized");
    } catch (er) {
        $log.error(er);
    }
}
