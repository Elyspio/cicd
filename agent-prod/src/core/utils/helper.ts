import {exec as _exec, ExecException} from "child_process";
import {resolve} from "path";
import {readdir} from "fs/promises";

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

    export async function getFiles(dir: string) {
        const dirents = await readdir(dir, {withFileTypes: true});
        const files = await Promise.all(dirents.map((dirent) => {
            const res = resolve(dir, dirent.name);
            return dirent.isDirectory() ? getFiles(res) : res;
        }));
        return Array.prototype.concat(...files) as string[];
    }
}
