import {IO, Nsp, Socket, SocketService, SocketSession} from "@tsed/socketio";
import * as SocketIO from "socket.io";
import {$log, AfterInit} from "@tsed/common";
import {events} from "../../../../config/events";
import {Config} from "../../../../core/services/manager/types";
import {Services} from "../../../../core/services";

@SocketService("/front")
export class FrontAutomateSocket  {

    @Nsp nsp: SocketIO.Namespace;


    constructor(@IO private io: SocketIO.Server) {
        Services.manager.on(events.config.update, (conf: Config) => {
            this.nsp.emit(events.config.update, conf)
        }) }

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
