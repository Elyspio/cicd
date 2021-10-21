import { Args, Input, IO, Nsp, Socket, SocketService } from "@tsed/socketio";
import * as SocketIO from "socket.io";
import { $log } from "@tsed/common";
import { FrontAutomateSocket } from "./front.automate.socket";
import { AgentSubscribe, BuildAgentModelAdd, ProductionAgentModelAdd } from "../models";
import { getLogger } from "../../../../core/utils/logger";
import { AgentBuild } from "../../../../core/services/hub/agent/builder";
import { AgentDeployment } from "../../../../core/services/hub/agent/production";
import { JobBuild } from "../../../../core/services/hub/job/build";
import { JobDeployment } from "../../../../core/services/hub/job/deployment";

@SocketService("/ws/agent/jobs")
export class AgentAutomateSocket {
	private static logger = getLogger.controller(AgentAutomateSocket);
	@Nsp nsp: SocketIO.Namespace;
	private clients = new Map<Socket, { config: AgentSubscribe; type: "production" | "build" }>();
	private services: { jobs: { deployments: JobDeployment; builds: JobBuild }; agents: { deployments: AgentDeployment; builds: AgentBuild } };

	constructor(@IO private io: SocketIO.Server, private frontSocket: FrontAutomateSocket, agentBuild: AgentBuild, agentProduction: AgentDeployment, jobBuild: JobBuild, jobDeploy: JobDeployment) {
		this.services = {
			agents: {
				builds: agentBuild,
				deployments: agentProduction,
			},
			jobs: {
				builds: jobBuild,
				deployments: jobDeploy,
			},
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
			let func = type === "build" ? this.services.agents.builds.delete : this.services.agents.deployments.delete;
			func = func.bind("build" ? this.services.agents.builds : this.services.agents.deployments);
			func(agent.config.uri);
			this.clients.delete(socket);
		}
	}

	@Input("jobs-stdout")
	async onTaskStdout(@Args(1) taskId: any, @Args(0, String) type: "build" | "deployment", @Args(2) stdout: string, @Socket socket: Socket) {
		$log.info("front-jobs-stdout", taskId, stdout);
		this.frontSocket.nsp.emit("front-jobs-stdout", stdout);

		let func = type === "build" ? this.services.jobs.builds.addStd : this.services.jobs.deployments.addStd;
		func = func.bind("build" ? this.services.jobs.builds : this.services.jobs.deployments);
		await func(taskId, "stdout", stdout);
	}

	@Input("agent-connection")
	async onAgentConnection(@Socket socket: SocketIO.Socket, @Args(0) type: "build" | "production", @Args(1) config: BuildAgentModelAdd | ProductionAgentModelAdd) {
		AgentAutomateSocket.logger.debug("new agent connection", { type, config });
		this.clients.set(socket, { config, type });
		let func = type === "build" ? this.services.agents.builds.add : this.services.agents.deployments.add;
		func = func.bind("build" ? this.services.agents.builds : this.services.agents.deployments);
		await func(config as any);
	}
}
