import {io} from "socket.io-client";


const host = clearUrl("localhost:4000")
const namespace = clearUrl("/front")

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


export const events = {
    job: {
        new: "JOB_NEW"
    }
}
