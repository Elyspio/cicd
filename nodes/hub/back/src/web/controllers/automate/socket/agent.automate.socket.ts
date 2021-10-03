import { Args, Input, IO, Nsp, Socket, SocketService } from "@tsed/socketio";
import * as SocketIO from "socket.io";
import { $log } from "@tsed/common";
import { FrontAutomateSocket } from "./front.automate.socket";
import { AgentSubscribe, BuildAgentModelAdd, ProductionAgentModelAdd } from "../models";
import { getLogger } from "../../../../core/utils/logger";
import { AgentBuild } from "../../../../core/services/hub/agent/builder";
import { AgentProduction } from "../../../../core/services/hub/agent/production";

@SocketService("/ws/agent/jobs")
export class AgentAutomateSocket {
	private static logger = getLogger.controller(AgentAutomateSocket);
	@Nsp nsp: SocketIO.Namespace;
	private clients = new Map<Socket, { config: AgentSubscribe; type: "production" | "build" }>();
	private services: { build: AgentBuild; deployments: AgentProduction };

	constructor(@IO private io: SocketIO.Server, private frontSocket: FrontAutomateSocket, agentBuild: AgentBuild, agentProduction: AgentProduction) {
		this.services = {
			build: agentBuild,
			deployments: agentProduction,
		};
	}

	/**&
	 * Triggered when a client disconnects from the Namespace.
	 */
	$onDisconnect(@Socket socket: SocketIO.Socket) {
		$log.info("A new client left");
		const agent = this.clients.get(socket);
		if (agent) {
			const type = agent.type;
			let func = type === "build" ? this.services.build.delete : this.services.deployments.delete;
			func = func.bind("build" ? this.services.build : this.services.deployments);
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
		@Args(1) config: BuildAgentModelAdd | ProductionAgentModelAdd
	) {
		AgentAutomateSocket.logger.debug("new agent connection", { type, config });
		this.clients.set(socket, { config, type });
		let func = type === "build" ? this.services.build.add : this.services.deployments.add;
		func = func.bind("build" ? this.services.build : this.services.deployments);
		await func(config as any);
	}
}
