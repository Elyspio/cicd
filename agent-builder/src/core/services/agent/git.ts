import simpleGit, {SimpleGit} from 'simple-git';
import {BuildConfig} from "../../../../../manager/back/src/core/services/manager/types";
import * as path from "path";
import {rm, stat} from "fs/promises";

const git: SimpleGit = simpleGit();


const buildFolder = process.env.BUILD_FOLDER ?? path.resolve(__dirname, "..", "..", "..", "..", "builds")

export class GitService {
    async initFolder({branch, commit, remote}: BuildConfig["github"]) {
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
        return localPath;
    }
}
