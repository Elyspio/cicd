import {inject, injectable} from "inversify";
import {FileModel, RepoWithBranchModel} from "../../apis/backend/generated";
import {DiKeysApi} from "../../di/di.keys.api";
import {CicdApi} from "../../apis/backend";

@injectable()
export class GithubService {

	@inject(DiKeysApi.cicd)
	private client!: CicdApi

	/**
	 * @param {string} username
	 * @param {string} repository
	 */
	async getBranches(username: string, repository: string): Promise<Array<string>> {
		return this.client.clients.github.getBranchesForRepository(username, repository).then(x => x.data);
	}

	/**
	 *
	 * @param {string} username
	 */
	async getRepositoriesData(username: string): Promise<RepoWithBranchModel[]> {
		return this.client.clients.github.getDockerRepository(username).then(x => x.data);
	}

	/**
	 *
	 * @param {string} username
	 * @param {string} repository
	 * @param {string} branch
	 */
	async getDockerfiles(username: string, repository: string, branch: string): Promise<Array<FileModel>> {
		return this.client.clients.github.getDockerfilesForRepository(username, repository, branch).then(x => x.data);
	}

	/**
	 *
	 * @param {string} username
	 */
	async getRepositories(username: string): Promise<string[]> {
		return this.client.clients.github.getRepositories(username).then(x => x.data);
	}
}
