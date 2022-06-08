import * as signalr from "@microsoft/signalr";


export const createSocket = () => {

	let hostname = window.config.endpoints.core.socket;
	const connection = new signalr.HubConnectionBuilder()
		.withUrl(hostname)
		.configureLogging(signalr.LogLevel.Warning)
		.withAutomaticReconnect({
			nextRetryDelayInMilliseconds(retryContext): number | null {
				return 1000;
			},
		})
		.build();


	console.debug("Create Socket", { hostname });

	connection.start().catch(err => {
		console.error(`error on websocket for ${hostname}: ${err.message}`);
	});


	return connection;
};