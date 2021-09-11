import {Octokit} from "@octokit/rest";
import {Service} from "@tsed/di";
import {Log} from "../../utils/decorators/logger";
import {getLogger} from "../../utils/logger";
import {githubToken} from "../../../config/github";


@Service()
export class GithubService {

	private static log = getLogger.service(GithubService)

	private client = new Octokit({
		auth: githubToken
	});


	@Log(GithubService.log)
	async listRepos(username: string) {
		const repos = await this.client.repos.listForUser({username})
		return repos.data.map(x => x.name);
	}

	@Log(GithubService.log)
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

	@Log(GithubService.log)
	async listBranch(username: string, repo: string) {
		const branches = await this.client.repos.listBranches({
			owner: username,
			repo
		})
		return branches.data.map(x => x.name)
	}

	@Log(GithubService.log)
	async getRepositoryInfo(username: string, repo: string) {


		return this.client.repos.get({repo, owner: username})

	}


	@Log(GithubService.log)
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
