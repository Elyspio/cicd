import {exec as _exec, ExecException, execSync} from "child_process";

export namespace Helper {

	export type ExecReturn = {
		stdout: string,
		stderr: string,
		error: ExecException | null,
		code: number | null,
		signal: NodeJS.Signals | null
	}

	export const exec = (command: string): Promise<ExecReturn> => {
		return new Promise(resolve => {
			let c, s;
			_exec(command, (error, stdout, stderr) => {
				resolve({
					stdout,
					stderr,
					error,
					code: c,
					signal: s
				})
			}).on("exit", (code, signal) => {
				c = code;
				s = signal;

			})
		})
	}

	export const isDev = () => process.env.NODE_ENV !== "production";


	export function removeTrallingSlash(uri) {
		if (uri[uri.length - 1] === "/") uri = uri.slice(0, -1)
		return uri;
	}

	export function getFunctionArgs(func: Function) {
		return (func + '')
			.replace(/[/][/].*$/mg, '') // strip single-line comments
			.replace(/\s+/g, '') // strip white space
			.replace(/[/][*][^/*]*[*][/]/g, '') // strip multi-line comments
			.split('){', 1)[0].replace(/^[^(]*[(]/, '') // extract the parameters
			.replace(/=[^,]+/g, '') // strip any ES6 defaults
			.split(',').filter(Boolean); // split & filter [""]
	}

	export function getIp() {
		if (process.env.OWN_IP) return process.env.OWN_IP
		return execSync("hostname -i").toString().trim()
	}
}
