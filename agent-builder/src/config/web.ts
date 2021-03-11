import * as path from "path";
import {$log} from "@tsed/common";


export const rootDir = path.resolve(__dirname, "..",);

let frontPath = process.env.FRONT_PATH ?? path.resolve(rootDir, "..", "..", "..", "front", "build")

$log.info({frontPath, rootDir});

export const webConfig: Partial<TsED.Configuration> = {
    rootDir,
    // seq: {
    //     url: "http://192.168.0.59:8045/"
    // },
    acceptMimes: ['application/json'],
    httpPort: process.env.HTTP_PORT || 4001,
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
    }]
};
