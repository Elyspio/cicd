import { Args, Input, IO, Nsp, Socket, SocketService, SocketSession } from "@tsed/socketio";
import * as SocketIO from "socket.io";
import { $log } from "@tsed/common";
import { events } from "../../../../config/events";
import { ConfigService } from "../../../../core/services/hub/config.service";

@SocketService("/ws/front")
export class FrontAutomateSocket {
	@Nsp nsp: SocketIO.Namespace;
	private services: { config: ConfigService };

	constructor(@IO private io: SocketIO.Server, config: ConfigService) {
		this.services = {
			config: config,
		};

		this.services.config.on("update", (conf) => {
			this.nsp.emit(events.config.update, conf);
		});
	}

	@Input("jobs-stdout")
	async onAgentStdout(@Args(0) taskId: number, @Args(1) stdout: string, @Socket socket: Socket) {
		this.nsp.emit("front-jobs-stdout", stdout);
	}

	/**
	 * Triggered the namespace is created
	 */
	$onNamespaceInit(nsp: SocketIO.Namespace) {}

	/**
	 * Triggered when a new client connects to the Namespace.
	 */
	async $onConnection(@Socket socket: SocketIO.Socket, @SocketSession session: SocketSession) {
		$log.info("A new client is born");
		this.nsp.emit(events.config.update, await this.services.config.export());
	}

	/**
	 * Triggered when a client disconnects from the Namespace.
	 */
	$onDisconnect(@Socket socket: SocketIO.Socket) {
		$log.info("A new client left");
	}
}
