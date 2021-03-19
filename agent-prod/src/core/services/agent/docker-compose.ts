import {$log} from "@tsed/common";
import {exec} from "child_process";
import * as  path from "path";
import {DeployConfigModel} from "../../../web/controllers/agent/models";

export class DockerComposeService {


    async pull({docker}: DeployConfigModel) {

        return new Promise<string>((resolve, reject) => {

            if (!docker || !docker.compose) {
                reject("Not implemented yet")
                return;
            }

            const folder = docker.compose.path;

            const completedCommand = `docker-compose pull`;
            $log.info("DockerComposeService.pull", {completedCommand, folder})
            exec(completedCommand, {cwd: path.dirname(folder)}, (error, stdout, stderr) => {
                $log.info("DockerComposeService.pull", {completedCommand, folder, error, stderr,})
                if (error) reject({error, stderr})
                else resolve(stderr);
            })
        })
    }

    async up({docker}: DeployConfigModel, daemon = true) {
        return new Promise<string>((resolve, reject) => {
            if (!docker || !docker.compose) {
                reject("Not implemented yet")
                return;
            }

            const folder = docker.compose.path;

            const completedCommand = `docker-compose up --remove-orphans ${daemon ? "-d" : ""}`;
            exec(completedCommand, {cwd: path.dirname(folder)}, (error, stdout, stderr) => {
                $log.info("DockerComposeService.up", {completedCommand, folder, error, stderr,})
                if (error) reject({error, stderr})
                else resolve(stderr);
            })
        })
    }

    async down({docker}: DeployConfigModel) {
        return new Promise<string>((resolve, reject) => {
            if (!docker || !docker.compose) {
                reject("Not implemented yet")
                return;
            }

            const folder = docker.compose.path;

            const completedCommand = `docker-compose down`;
            exec(completedCommand, {cwd: path.dirname(folder)}, (error, stdout, stderr) => {
                $log.info("DockerComposeService.down", {completedCommand, folder, error, stderr,})
                if (error) reject({error, stderr})
                else resolve(stderr);
            })
        })
    }


}
