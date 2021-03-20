import {$log} from "@tsed/common";
import {exec} from "child_process";
import * as  path from "path";
import {DeployConfigModel} from "../../../web/controllers/agent/models";
import {Helper} from "../../utils/helper";

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

    /**
     * List all docker-compose.yml files in folders
     * @param folders
     */
    async list(folders: string[]) {
        folders = folders.map(f => path.resolve(path.join(__dirname, "..", "..", "..", ".."), f))
        const files = await Promise.all(folders.map(Helper.getFiles))
        return files.flat().filter(f => f.endsWith("docker-compose.yml"));
    }

}
