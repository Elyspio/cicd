import {Octokit} from "@octokit/rest";
import {githubToken} from "../../../config/github";


export class GithubService {

	private client = new Octokit({
		auth: githubToken
	});


	async listRepos(username: string) {
		const repos = await this.client.repos.listForUser({username})
		return repos.data.map(x => x.name);
	}

	async listBranch(username: string, repo: string) {
		const branches = await this.client.repos.listBranches({
			owner: username,
			repo
		})
		return branches.data.map(x => x.name)
	}

	async getRepositoryInfo(username: string, repo: string) {
		return this.client.repos.get({repo, owner: username})
	}


}
