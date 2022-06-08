import * as signalr from "@microsoft/signalr";
import { Services } from "../index";
import { $log } from "@tsed/common";
import { getLogger } from "../../utils/logger";

const log = getLogger("WebSocket");
const hostname = process.env.HUD_SOCKET_URL ?? "http://localhost:4000/ws/agents";

async function onConnection(connection: signalr.HubConnection) {
	const conf = await Services.agent.getConfig();
	log.info(`connected to ${hostname}`, conf);
	await connection.invoke("agent-connection/deploy", { Url: conf.url, Abilities: conf.abilities, Folders: conf.folders });
}


export const createSocket = () => {

	const connection = new signalr.HubConnectionBuilder()
		.withUrl(hostname)
		.configureLogging(signalr.LogLevel.Warning)
		.withAutomaticReconnect({
			nextRetryDelayInMilliseconds(retryContext): number | null {
				return 1000;
			},
		})
		.build();


	$log.debug("Create Socket", { hostname });

	connection.start().then(() => onConnection(connection)).catch(err => {
		log.error(`error on websocket for ${hostname}: ${err.message}`);
	});

	connection.onreconnected(() => onConnection(connection));

	return connection;
};

export const hudSocket = createSocket();
