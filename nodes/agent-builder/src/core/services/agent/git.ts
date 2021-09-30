import simpleGit, { SimpleGit } from "simple-git";
import * as path from "path";
import { rm, stat } from "fs/promises";
import { hudSocket } from "./socket";
import { BuildConfigModel } from "../../../web/controllers/agent/models";

const git: SimpleGit = simpleGit();

const buildFolder = process.env.BUILD_FOLDER ?? path.resolve(__dirname, "..", "..", "..", "..", "builds");

export class GitService {
	async initFolder({
		config: {
			github: { remote, branch },
		},
		id,
	}: BuildConfigModel) {
		const localPath = path.resolve(buildFolder, remote.slice(remote.lastIndexOf("/") + 1, remote.indexOf(".git")));

		try {
			await stat(localPath);
			await rm(localPath, { recursive: true, force: true });
		} catch (e) {}

		await git.clone(remote, localPath, ["-b", branch]);
		hudSocket.emit("jobs-stdout", id, `Repository ${remote} cloned at ${localPath}`);
		return localPath;
	}
}
