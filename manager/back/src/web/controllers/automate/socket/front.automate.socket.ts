import {Args, Input, IO, Nsp, Socket, SocketService, SocketSession} from "@tsed/socketio";
import * as SocketIO from "socket.io";
import {$log} from "@tsed/common";

@SocketService("/front")
export class FrontAutomateSocket {

    @Nsp nsp: SocketIO.Namespace;


    constructor(@IO private io: SocketIO.Server) {
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
        $log.info("A new client is born", {socket, session})
    }

    /**
     * Triggered when a client disconnects from the Namespace.
     */
    $onDisconnect(@Socket socket: SocketIO.Socket) {
        $log.info("A new client left", {socket})
    }
}
