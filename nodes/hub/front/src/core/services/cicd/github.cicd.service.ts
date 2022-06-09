import { inject, injectable } from "inversify";
import { GitHubRepository } from "../../apis/backend/generated";
import { CicdApi } from "../../apis/backend";

@injectable()
export class GithubService {
	@inject(CicdApi)
	private client!: CicdApi;

	/**
	 *
	 * @param {string} username
	 */
	async getRepositoriesData(username: string): Promise<GitHubRepository[]> {
		return this.client.github.getRepos(username).then((x) => x.data);
	}


}
