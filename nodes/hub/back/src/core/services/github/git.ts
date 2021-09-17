import {readdir, rm, stat} from "fs/promises";
import * as  os from "os";
import simpleGit, {SimpleGit} from "simple-git/promise";
import * as nodePath from "path"
import {getLogger} from "../../utils/logger";
import {Log} from "../../utils/decorators/logger";

const git: SimpleGit = simpleGit();

export class GitService {

	private static log = getLogger.service(GitService)


	@Log(GitService.log)
	async list(path: string, origin: string) {
		const files = await readdir(path)
		const ret: { path: string, key: string, size: number }[] = [];

		await Promise.all(files.map(async file => {
			const filePath = nodePath.join(path, file);
			const info = await stat(filePath)
			if (info.isFile()) ret.push({
				path: nodePath.relative(origin, filePath),
				key: file,
				size: info.size
			})
			if (info.isDirectory() && !filePath.includes(".git") && !filePath.includes(".idea")) ret.push(...await this.list(filePath, origin))
		}))

		return ret;
	}


	@Log(GitService.log)
	private async initFolder(remote: string, branch: string) {
		const repoName = remote.slice(remote.lastIndexOf("/") + 1, remote.indexOf(".git"));
		const tempDir = nodePath.join(os.tmpdir(), "repositories", repoName, branch);

		try {
			await stat(tempDir);
			await rm(tempDir, {recursive: true, force: true})
		} catch (e) {
		}

		await git.clone(remote, tempDir, ["-b", branch])
		return tempDir;
	}
}
