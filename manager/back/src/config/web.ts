import * as path from "path";
import {$log} from "@tsed/common";
import "@tsed/socketio"; // import socket.io Ts.ED module


export const rootDir = path.resolve(__dirname, "..",);

let frontPath = process.env.FRONT_PATH ?? path.resolve(rootDir, "..", "..", "..", "front", "build")

$log.info({frontPath, rootDir});

export const webConfig: Partial<TsED.Configuration> = {
    rootDir,
    acceptMimes: ['application/json'],
    httpPort: process.env.HTTP_PORT || 4000,
    httpsPort: false, // CHANGE
    mount: {
        '/core': [
            `${rootDir}/web/controllers/**/*.ts`
        ]
    },
    exclude: [
        '**/*.spec.ts'
    ],
    statics: {
        '/': [
            {root: frontPath,}
        ]
    },
    swagger: [{
        path: "/swagger",
        specVersion: "3.0.1"
    }],
    // @ts-ignore
    socketIO: {
        cors: {origin: true},
    }


};
