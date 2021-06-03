import {Octokit} from "@octokit/rest";
import {githubToken} from "../../../config/github";
import {Service} from "@tsed/di";
import {GitService} from "./git";
import {Services} from "../index";
import {log} from "../../utils/decorators/logger";


@Service()
export class GithubService {
	private client = new Octokit({
		auth: githubToken
	});


	@log("service")
	async listRepos(username: string) {
		const repos = await this.client.repos.listForUser({username})
		return repos.data.map(x => x.name);
	}

	@log("service")
	async listReposWithDockerfile(username: string) {
		const repos = await this.listRepos(username);
		const ret = Array<{ repo: string, branch: string }>();

		await Promise.all(repos.map(async (repo) => {
			const branches = await this.listBranch(username, repo);
			await Promise.all(branches.map(async branch => {
				const dockerfiles = await Services.github.local.getDockerfiles(username, repo, branch)
				if (dockerfiles.length > 0) {
					ret.push({ repo, branch})
				}
			}))
		}))

		return ret;

	}

	@log("service")
	async listBranch(username: string, repo: string) {
		const branches = await this.client.repos.listBranches({
			owner: username,
			repo
		})
		return branches.data.map(x => x.name)
	}

	@log("service")
	async getRepositoryInfo(username: string, repo: string) {
		return this.client.repos.get({repo, owner: username})
	}


}
