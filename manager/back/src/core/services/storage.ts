import {promises, readFileSync, writeFileSync} from "fs";
import * as path from "path";
import * as os from "os";

const {writeFile, readFile} = promises

export const files = {
    conf: process.env.CONF_PATH ?? "/app/conf.json"
} as const

export class StorageService {

    store(name: string, data: string | object, sync: boolean = false) {
        if (typeof data === "object") data = JSON.stringify(data, null, 2)

        if (name[0] === "~") {
            name = path.join(os.homedir(), name.slice(1))
        }
        if (sync) return writeFileSync(name, data)

        return writeFile(path.resolve(name), data);
    }

    read<T = undefined>(name: string, sync: boolean = false) {
        return new Promise<T>(resolve => resolve(readFile(name).then(x => JSON.parse(x.toString()))))
    }

    readSync<T>(name: string) {
        return JSON.parse(readFileSync(name).toString()) as T
    }

}
