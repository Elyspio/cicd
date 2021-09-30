import { exec as _exec, ExecException, execSync } from "child_process";
import { resolve } from "path";
import { readdir } from "fs/promises";

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

	export async function getFiles(dir: string) {
		const dirents = await readdir(dir, { withFileTypes: true });
		const files = await Promise.all(
			dirents.map((dirent) => {
				const res = resolve(dir, dirent.name);
				return dirent.isDirectory() ? getFiles(res) : res;
			})
		);
		return Array.prototype.concat(...files) as string[];
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

	export function deepEqual(obj1: any, obj2: any) {
		if (obj1 === obj2) {
			return true;
		} else if (isObject(obj1) && isObject(obj2)) {
			if (Object.keys(obj1).length !== Object.keys(obj2).length) {
				return false;
			}
			for (const prop in obj1) {
				if (!deepEqual(obj1[prop], obj2[prop])) {
					return false;
				}
			}
			return true;
		}

		// Private
		function isObject(obj: any) {
			return typeof obj === "object" && obj != null;
		}
	}

	export function getIp() {
		if (process.env.NODE_ENV !== "production") return "localhost";
		return execSync("hostname -i").toString().trim();
	}
}
