import io from "socket.io-client";
import { Services } from "../index";
import { clearUrl, socketInfos } from "../../../config/agent";
import { getLogger } from "../../utils/logger";

const log = getLogger("Socket");

export const createSocket = () => {
	const { path, namespace, hostname } = socketInfos;

	log.info({
		path,
		namespace,
		hostname,
	});

	const socket = io(`http://${clearUrl(hostname + "/" + namespace)}`, {
		transports: ["websocket"],
		path,
		autoConnect: true,
		hostname,
	});

	socket.on("connect", async () => {
		const conf = await Services.agent.getConfig();
		log.info(`connected to ${hostname}`);
		socket.emit("agent-connection", "production", conf);
	});
	socket.on("connect_error", (err) => {
		log.error(`error on websocket for ${hostname}: ${err.message}`);
	});

	return socket;
};

export let hudSocket: ReturnType<typeof createSocket>;

export function initSocket() {
	hudSocket = createSocket();
}
