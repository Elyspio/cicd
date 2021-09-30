import io from "socket.io-client";

export const createSocket = () => {
	let { namespace, hostname } = window.config.endpoints.core.socket;
	const path = clearUrl(
		`${process.env.NODE_ENV === "production" ? "/cicd/" : "/"}${namespace}`,
	);
	return io(clearUrl(`${hostname}/${namespace}`), {
		transports: ["websocket"],
		path,
		autoConnect: true,
	});
};

function clearUrl(url: string): string {
	return url.replace(/\/\//g, "/");
}
