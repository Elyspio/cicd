import io from "socket.io-client";
import {Services} from "../index";
import {$log} from "@tsed/common";
import {getLogger} from "../../utils/logger";


const log = getLogger("WebSocket");

function clearUrl(url: string): string {
	return url.replaceAll("//", "/")
}


export const createSocket = () => {

	const hostname = clearUrl(process.env.HUD_SOCKET_URL ?? "localhost:4000")
	const namespace = clearUrl(process.env.HUD_SOCKET_NAMESPACE ?? "ws/agent/jobs")
	let path = clearUrl(process.env.HUD_SOCKET_PATH ?? "/")

	path = clearUrl(path + "/" + namespace)


	const socket = io(`http://${clearUrl(hostname + "/" + namespace)}`, {
		transports: ["websocket"],
		path,
		autoConnect: true,
		hostname,
	});


	$log.debug("Create Socket", {namespace, hostname})

	socket.on("connect", async () => {
		const conf = await Services.agent.getConfig();
		log.info(`connected to ${hostname}`)
		socket.emit("agent-connection", "build", conf);
	})
	socket.on("connect_error", err => {
		log.error(`error on websocket for ${hostname}: ${err.message}`)
	})

	return socket;
};

export const hudSocket = createSocket();


