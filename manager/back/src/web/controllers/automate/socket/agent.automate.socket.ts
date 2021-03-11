import {Args, Input, IO, Nsp, Socket, SocketService, SocketSession} from "@tsed/socketio";
import * as SocketIO from "socket.io";
import {$log} from "@tsed/common";
import {FrontAutomateSocket} from "./front.automate.socket";

@SocketService("/agent/job")
export class AgentAutomateSocket {

    @Nsp nsp: SocketIO.Namespace;

    constructor(@IO private io: SocketIO.Server, private frontSocket: FrontAutomateSocket) {
    }


    @Input("job-stdout")
    async myMethod(@Args(0) taskId: number, @Args(1) stdout: string, @Socket socket: Socket) {
        $log.info("front-job-stdout", taskId, stdout)
        this.frontSocket.nsp.emit("front-job-stdout", stdout)
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

    }

    /**
     * Triggered when a client disconnects from the Namespace.
     */
    $onDisconnect(@Socket socket: SocketIO.Socket) {

    }
}
