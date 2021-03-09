import {Configuration, Inject} from "@tsed/di";
import {$log, PlatformApplication} from "@tsed/common";
import {middlewares} from "./middleware/common/raw";
import "@tsed/platform-express"; // /!\ keep this import
import "@tsed/seq"; // import seq Ts.ED module
import "@tsed/swagger";
import {webConfig} from "../config/web";
import * as path from "path";

$log.name = process.env.APP_NAME ?? "Automatize -- Agent builder"

$log.appenders.set("everything", {
    type: 'file',
    filename: path.resolve((process.env.LOG_FOLDER ?? `${__dirname}/../../logs`), "app.log"),
    pattern: '.yyyy-MM-dd'
});

@Configuration(webConfig)
export class Server {

    @Inject()
    app: PlatformApplication;

    @Configuration()
    settings: Configuration;

    $beforeRoutesInit() {
        this.app.use(...middlewares)
        return null;
    }
}
