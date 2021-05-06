import io from "socket.io-client";
import {initConf} from "../../view/store/module/config/reducer";


export const createSocket = () => {
	const conf = initConf.endpoints.core

	const namespace = clearUrl(conf.socket.namespace)
	const hostname = clearUrl(conf.socket.hostname);
	const scheme = conf.socket.scheme
	const path = conf.socket.path

	const socket = io(`${scheme}://${clearUrl(hostname + "/" + namespace)}`, {
		path
	});

	console.debug("Create Socket", {namespace, hostname, socket})

	return socket;
};

function clearUrl(url: string): string {
	return url.replace(/\/\//g, "/")
}




