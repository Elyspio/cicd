import {io} from "socket.io-client";
import {initConf} from "../../view/store/module/config/reducer";



export const createSocket = () => {
    const conf = initConf.endpoints.core

    const namespace = clearUrl(conf.socket.namespace)

    const server = io(`${conf.api}${namespace}`, {
        autoConnect: false
    });
    return server.connect();
};

function clearUrl(url: string): string {
    return url.replace(/\/\//g, "/")
}
