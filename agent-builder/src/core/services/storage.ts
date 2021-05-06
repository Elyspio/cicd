import {promises, readFileSync, writeFileSync} from "fs";
import * as path from "path";
import * as os from "os";

const {writeFile, readFile} = promises

export const files = {
	conf: process.env.CONF_PATH ?? path.resolve(__dirname, "../../..", "conf.json")
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

	async read<T = undefined>(name: string) {
		return await readFile(name).then(x => JSON.parse(x.toString()))
	}

	readSync<T>(name: string) {
		const text = readFileSync(name).toString();
		return JSON.parse(text) as T
	}
}
