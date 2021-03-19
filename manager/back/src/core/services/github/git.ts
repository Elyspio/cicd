import {readdir, rm, stat} from "fs/promises";
import * as  os from "os";
import simpleGit, {SimpleGit} from "simple-git/promise";
import * as nodePath from "path"
import {Services} from "../index";

const git: SimpleGit = simpleGit();

export class GitService {

    async getDockerfiles(username: string, repo: string, branch: string) {

        const remote = (await Services.github.remote.getRepositoryInfo(username, repo)).data.git_url

        const folder = await this.initFolder(remote, branch)

        const files = (await this.list(folder, folder)).filter(p => p.key === "Dockerfile")

        await rm(folder, {recursive: true, force: true})

        return files;
    }

    async list(path: string, origin: string) {
        const files = await readdir(path)
        const ret: { path: string, key: string, size: number }[] = [];

        for (const file of files) {
            const filePath = nodePath.join(path, file);
            const info = await stat(filePath)
            if (info.isFile()) ret.push({
                path: nodePath.relative(origin, filePath),
                key: file,
                size: info.size
            })
            if (info.isDirectory()) ret.push(...await this.list(filePath, origin))
        }

        return ret;
    }

    private async initFolder(remote: string, branch: string) {
        const repoName = remote.slice(remote.lastIndexOf("/") + 1, remote.indexOf(".git"));
        const tempDir = nodePath.join(os.tmpdir(), "repositories", repoName);

        try {
            await stat(tempDir);
            await rm(tempDir, {recursive: true, force: true})
        } catch (e) {
        }

        await git.clone(remote, tempDir, ["-b", branch])
        return tempDir;
    }
}
