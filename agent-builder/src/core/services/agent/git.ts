import simpleGit, {SimpleGit} from 'simple-git';
import {BuildConfig, ConfigWithId} from "../../../../../manager/back/src/core/services/manager/types";
import * as path from "path";
import {rm, stat} from "fs/promises";
import {managerSocket} from "./socket";

const git: SimpleGit = simpleGit();


const buildFolder = process.env.BUILD_FOLDER ?? path.resolve(__dirname, "..", "..", "..", "..", "builds")

export class GitService {
    async initFolder({github: {remote, branch}, id}: ConfigWithId<BuildConfig>) {
        const localPath = path.resolve(buildFolder, remote.slice(remote.lastIndexOf("/") + 1, remote.indexOf(".git")));

        try {
            await stat(localPath);
            await rm(localPath, {recursive: true, force: true})
        } catch (e) {
        }


        await git.clone(remote, localPath, ["-b", branch])
        // if(commit) {
        //     await git.checkout(commit)
        // }
        managerSocket.emit("jobs-stdout", id, `Repository ${remote} cloned at ${localPath}`)
        return localPath;
    }
}
