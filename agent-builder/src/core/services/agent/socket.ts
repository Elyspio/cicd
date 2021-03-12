import {io} from "socket.io-client";


const host = clearUrl(process.env.MANAGER_SOCKET_URL ?? "localhost:4000")
const namespace = clearUrl(process.env.MANAGER_SOCKET_NAMESPACE ?? "/agent/jobs")

export const createSocket = () => {
    const server = io(`http://${host}${namespace}`, {
        autoConnect: false
    });
    // @ts-ignore
    // server.nsp = namespace
    // server.io.opts.path = namespace
    return server.connect();
};

export const managerSocket = createSocket();

function clearUrl(url: string): string {
    return url.replace(/\/\//g, "/")
}


