import {BuildConfig} from "../../../../../manager/back/src/core/services/manager/types";
import * as path from "path";
import {$log} from "@tsed/common";
import {exec} from "child_process";

export class DockerService {
    async buildAndPush(folder: string, conf: BuildConfig["docker"]) {
        let command = ["docker"];
        if (conf.platforms.length > 0) {
            command.push("buildx")
        }
        command.push(`build`)
        if (conf.platforms.length > 0) {
            command.push(` --platform "${conf.platforms.join(",")}"`)
        }


        return Promise.all(
            conf.dockerfiles.map(df => {
                const dockerfilePath = path.join(folder, df.path)
                return new Promise<string>((resolve, reject) => {
                    const completedCommand = `${command.join(" ")} -f ${dockerfilePath} ${df.wd} -t ${conf.username}/${df.image}:${df.tag ?? "latest"} --push`;
                    $log.info("BuilderAgentService.build", {completedCommand, df})
                    exec(completedCommand, {cwd: folder}, (error, stdout, stderr) => {
                        if (error) reject({error, stderr})
                        else resolve(stderr);
                    })
                })
            })
          )
    }
}
