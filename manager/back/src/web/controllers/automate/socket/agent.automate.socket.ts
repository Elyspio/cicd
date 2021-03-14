import {Args, Input, IO, Nsp, Socket, SocketService} from "@tsed/socketio";
import * as SocketIO from "socket.io";
import {$log} from "@tsed/common";
import {FrontAutomateSocket} from "./front.automate.socket";


@SocketService("/agent/jobs")
export class AgentAutomateSocket {

    @Nsp nsp: SocketIO.Namespace;

    constructor(@IO private io: SocketIO.Server, private frontSocket: FrontAutomateSocket) {
    }

    @Input("jobs-stdout")
    async myMethod(@Args(0) taskId: number, @Args(1) stdout: string, @Socket socket: Socket) {
        $log.info("front-jobs-stdout", taskId, stdout)
        this.frontSocket.nsp.emit("front-jobs-stdout", stdout)
    }

}


