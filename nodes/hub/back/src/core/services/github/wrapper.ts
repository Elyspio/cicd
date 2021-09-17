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
		return repos.data.map(x => x.name);
	}

	@Log(GithubWrapper.log)
	async listReposWithDockerfile(username: string) {
		const repos = await this.listRepos(username);
		const ret = Array<{ repo: string, branch: string, dockerfiles: string[] }>();

		await Promise.all(repos.map(async (repo) => {
			const branches = await this.listBranch(username, repo);
			await Promise.all(branches.map(async branch => {
				const dockerfiles = await this.getDockerfiles(username, repo, branch)
				if (dockerfiles.length > 0) {
					ret.push({repo, branch, dockerfiles})
				}
			}))
		}))

		return ret;

	}

	@Log(GithubWrapper.log)
	async listBranch(username: string, repo: string) {
		const branches = await this.client.repos.listBranches({
			owner: username,
			repo
		})
		return branches.data.map(x => x.name)
	}

	@Log(GithubWrapper.log)
	async getRepositoryInfo(username: string, repo: string) {
		return this.client.repos.get({repo, owner: username})
	}

	@Log(GithubWrapper.log)
	async getDockerfiles(owner: string, repo: string, branch) {

		const parent = await this.client.git.getRef({
			repo,
			owner,
			ref: `heads/${branch}`
		});
		const latestCommit = await this.client.git.getCommit({owner, repo, commit_sha: parent.data.object.sha});
		const {data: tree} = await this.client.git.getTree({
			repo,
			tree_sha: latestCommit.data.tree.sha,
			owner,
			recursive: "true",

		});

		return tree.tree.filter(node => node.path && node.path.toLowerCase().includes("dockerfile")).map(node => node.path!)

	}
}
