import {io} from "socket.io-client";


function clearUrl(url: string): string {
	return url.replace(/\/\//g, "/")
}


export const createSocket = () => {

	const hostname = clearUrl(process.env.MANAGER_SOCKET_URL ?? "localhost:4000")
	const namespace = clearUrl(process.env.MANAGER_SOCKET_NAMESPACE ?? "/agent/jobs")
	const scheme = clearUrl(process.env.MANAGER_SOCKET_SCHEME ?? "http")
	const path = clearUrl(process.env.MANAGER_SOCKET_PATH ?? "/")

	const socket = io(`${scheme}://${clearUrl(hostname + "/" + namespace)}`, {
		path
	});

	console.debug("Create Socket", {namespace, hostname, socket})

	return socket;
};

export const managerSocket = createSocket();


