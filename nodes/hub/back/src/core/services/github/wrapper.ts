import {getLogger} from "../../utils/logger";
import {Octokit} from "@octokit/rest";
import {Log} from "../../utils/decorators/logger";

export class GithubWrapper {
	private static log = getLogger.service(GithubWrapper)

	private client: Octokit;

	constructor(token: string) {
		this.client = new Octokit({
			auth: token,
		});
	}

	@Log(GithubWrapper.log)
	async listRepos(username: string) {
		const repos = await this.client.repos.listForUser({username})
		return repos.data.filter(repo => !repo.archived && !repo.disabled).map(x => x.name);
	}

	@Log(GithubWrapper.log)
	async listReposWithAllData(username: string) {
		const repos = await this.listRepos(username);
		const ret = Array<{ repo: string, branch: string } & GithubParseRepoTree>();

		await Promise.all(repos.map(async (repo) => {
			const branches = await this.listBranch(username, repo);
			await Promise.all(branches.map(async branch => {
				const data = await this.parseRepoTree(username, repo, branch)
				ret.push({repo, branch, ...data})
			}))
		}))

		return ret;

	}

	@Log(GithubWrapper.log)
	async listBranch(username: string, repo: string) {
		const branches = await this.client.repos.listBranches({
			owner: username, repo
		})
		return branches.data.map(x => x.name)
	}

	@Log(GithubWrapper.log)
	async getRepositoryInfo(username: string, repo: string) {
		return this.client.repos.get({repo, owner: username})
	}

	@Log(GithubWrapper.log)
	async parseRepoTree(owner: string, repo: string, branch): Promise<GithubParseRepoTree> {

		const parent = await this.client.git.getRef({
			repo, owner, ref: `heads/${branch}`
		});
		const latestCommit = await this.client.git.getCommit({owner, repo, commit_sha: parent.data.object.sha});
		const {data: tree} = await this.client.git.getTree({
			repo, tree_sha: latestCommit.data.tree.sha, owner, recursive: "true",

		});

		const bake = tree.tree.find(node => node.path && node.path.toLowerCase().includes("docker-bake.hcl"))?.path;
		const dockerfiles = tree.tree.filter(node => node.path && node.path.toLowerCase().includes("dockerfile")).map(node => node.path!);
		const nodes = tree.tree.filter(node => node.path).map(node => {
			let type: NodeType | "unknown" = "unknown";
			switch (node.type) {
				case "tree":
					type = "folder"
					break;
				case "blob":
					type = "file";
					break;
			}

			return ({
				type: type as NodeType,
				path: node.path!
			});
		});
		// const directories = new Set<string>();
		// [...nodes].forEach(node => directories.add(path.basename(node.path)))
		// nodes.push(...[...directories].map(folder => ({type: "folder" as NodeType, path: folder})));

		return {
			dockerfiles, bake, nodes
		}

	}
}

export type NodeType = "folder" | "file"

type GithubParseRepoTree = {
	dockerfiles: string[], bake?: string, nodes: { type: NodeType, path: string }[]
}
