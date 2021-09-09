export function clearUrl(url: string): string {
	return url.replaceAll("//", "/")
}


const namespace = clearUrl(process.env.HUD_SOCKET_NAMESPACE ?? "ws/agent/jobs");
export const socketInfos = {
	hostname: clearUrl(process.env.HUD_SOCKET_URL ?? "localhost:4000"),
	namespace,
	path: clearUrl(process.env.HUD_SOCKET_PATH ?? "/" + "/" + namespace)
}
