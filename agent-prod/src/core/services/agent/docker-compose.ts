import {DeployConfig} from "../../../../../manager/back/src/core/services/manager/types";
import {$log} from "@tsed/common";
import {exec} from "child_process";

export class DockerComposeService {


    async pull(folder: DeployConfig["docker"]["compose"]["path"]) {
        return new Promise<string>((resolve, reject) => {
            const completedCommand = `docker-compose pull`;
            $log.info("DockerComposeService.pull", {completedCommand, folder})
            exec(completedCommand, {cwd: folder}, (error, stdout, stderr) => {
                if (error) reject({error, stderr})
                else resolve(stderr);
            })
        })
    }

    async up(folder: DeployConfig["docker"]["compose"]["path"], daemon: boolean = true) {
        return new Promise<string>((resolve, reject) => {
            const completedCommand = `docker-compose up ${daemon ? "-d" : ""}`;
            $log.info("DockerComposeService.up", {completedCommand, folder})
            exec(completedCommand, {cwd: folder}, (error, stdout, stderr) => {
                if (error) reject({error, stderr})
                else resolve(stderr);
            })
        })
    }


}
