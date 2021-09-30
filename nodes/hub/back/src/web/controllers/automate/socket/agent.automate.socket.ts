import { Args, Input, IO, Nsp, Socket, SocketService } from "@tsed/socketio";
import * as SocketIO from "socket.io";
import { $log } from "@tsed/common";
import { FrontAutomateSocket } from "./front.automate.socket";
import { AgentSubscribe, BuildAgentModelAdd, ProductionAgentModelAdd } from "../models";
import { Services } from "../../../../core/services";
import { getLogger } from "../../../../core/utils/logger";

@SocketService("/ws/agent/jobs")
export class AgentAutomateSocket {

	private static logger = getLogger.controller(AgentAutomateSocket);
	@Nsp nsp: SocketIO.Namespace;
	private clients = new Map<Socket, { config: AgentSubscribe, type: "production" | "build" }>();


	constructor(@IO private io: SocketIO.Server, private frontSocket: FrontAutomateSocket) {
	}


	/**&
	 * Triggered when a client disconnects from the Namespace.
	 */
	$onDisconnect(@Socket socket: SocketIO.Socket) {
		$log.info("A new client left");
		const agent = this.clients.get(socket);
		if (agent) {
			const type = agent.type;
			let func = type === "build" ? Services.hub.agents.builder.delete : Services.hub.agents.production.delete;
			func = func.bind("build" ? Services.hub.agents.builder : Services.hub.agents.production);
			func(agent.config.uri);
			this.clients.delete(socket);
		}
	}

	@Input("jobs-stdout")
	async myMethod(@Args(0) taskId: number, @Args(1) stdout: string, @Socket socket: Socket) {
		$log.info("front-jobs-stdout", taskId, stdout);
		this.frontSocket.nsp.emit("front-jobs-stdout", stdout);
	}

	@Input("agent-connection")
	async onAgentConnection(
		@Socket socket: SocketIO.Socket,
		@Args(0) type: "build" | "production",
		@Args(1) config: BuildAgentModelAdd | ProductionAgentModelAdd,
	) {
		AgentAutomateSocket.logger.debug("new agent connection", { type, config });
		this.clients.set(socket, { config, type });
		let func = type === "build" ? Services.hub.agents.builder.add : Services.hub.agents.production.add;
		func = func.bind("build" ? Services.hub.agents.builder : Services.hub.agents.production);
		func(config as any);
	}

}


