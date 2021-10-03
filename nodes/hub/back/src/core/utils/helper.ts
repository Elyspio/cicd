import { exec as _exec, ExecException } from "child_process";

const { resolve } = require("path");
const { readdir } = require("fs").promises;
export namespace Helper {
	export type ExecReturn = {
		stdout: string;
		stderr: string;
		error: ExecException | null;
		code: number | null;
		signal: NodeJS.Signals | null;
	};

	export const exec = (command: string): Promise<ExecReturn> => {
		return new Promise((resolve) => {
			let c, s;
			_exec(command, (error, stdout, stderr) => {
				resolve({
					stdout,
					stderr,
					error,
					code: c,
					signal: s,
				});
			}).on("exit", (code, signal) => {
				c = code;
				s = signal;
			});
		});
	};

	export const isDev = () => process.env.NODE_ENV !== "production";

	export const isEqual = (x: any, y: any) => {
		x = JSON.parse(JSON.stringify(x));
		y = JSON.parse(JSON.stringify(y));
		if (x === y) {
			return true;
		} else if (typeof x == "object" && x != null && typeof y == "object" && y != null) {
			if (Object.keys(x).length != Object.keys(y).length) return false;

			for (const prop in x) {
				if (y.hasOwnProperty(prop)) {
					if (!isEqual(x[prop], y[prop])) return false;
				} else return false;
			}

			return true;
		} else return false;
	};

	export async function* getFiles(dir) {
		const dirents = await readdir(dir, { withFileTypes: true });
		for (const dirent of dirents) {
			const res = resolve(dir, dirent.name);
			if (dirent.isDirectory()) {
				yield* getFiles(res);
			} else {
				yield res;
			}
		}
	}

	export function getCurrentFunctionName(skipOne: boolean) {
		return new Error()
			.stack!.split("\n")
			[2 + (skipOne ? 1 : 0)] // " at functionName ( ..." => "functionName"
			.replace(/^\s+at\s+(.+?)\s.+/g, "$1");
	}

	export function getFunctionArgs(func: Function) {
		return (func + "")
			.replace(/[/][/].*$/gm, "") // strip single-line comments
			.replace(/\s+/g, "") // strip white space
			.replace(/[/][*][^/*]*[*][/]/g, "") // strip multi-line comments
			.split("){", 1)[0]
			.replace(/^[^(]*[(]/, "") // extract the parameters
			.replace(/=[^,]+/g, "") // strip any ES6 defaults
			.split(",")
			.filter(Boolean); // split & filter [""]
	}
}
