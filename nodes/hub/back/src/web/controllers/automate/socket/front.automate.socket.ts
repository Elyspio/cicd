import { Args, Input, IO, Nsp, Socket, SocketService, SocketSession } from "@tsed/socketio";
import * as SocketIO from "socket.io";
import { $log } from "@tsed/common";
import { events } from "../../../../config/events";
import { Config } from "../../../../core/services/hub/types";
import { Services } from "../../../../core/services";

@SocketService("/ws/front")
export class FrontAutomateSocket {

	@Nsp nsp: SocketIO.Namespace;


	constructor(@IO private io: SocketIO.Server) {
		Services.hub.on(events.config.update, (conf: Config) => {
			this.nsp.emit(events.config.update, conf);
		});
	}


	@Input("jobs-stdout")
	async onAgentStdout(@Args(0) taskId: number, @Args(1) stdout: string, @Socket socket: Socket) {
		$log.info("front-jobs-stdout", taskId, stdout);
		this.nsp.emit("front-jobs-stdout", stdout);
	}

	/**
	 * Triggered the namespace is created
	 */
	$onNamespaceInit(nsp: SocketIO.Namespace) {

	}

	/**
	 * Triggered when a new client connects to the Namespace.
	 */
	$onConnection(@Socket socket: SocketIO.Socket, @SocketSession session: SocketSession) {
		$log.info("A new client is born");
		this.nsp.emit(events.config.update, Services.hub.exportConfig());
	}

	/**
	 * Triggered when a client disconnects from the Namespace.
	 */
	$onDisconnect(@Socket socket: SocketIO.Socket) {
		$log.info("A new client left");
	}
}
