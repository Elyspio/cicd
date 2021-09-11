import {Controller, Get, PathParams, Req} from "@tsed/common";
import {Name, Returns} from "@tsed/schema";
import * as Express from "express"
import {FileModel, RepoWithBranchModel} from "./models";
import {GithubService} from "../../../core/services/github/github";
import {GitService} from "../../../core/services/github/git";
import {Protected} from "../../middleware/protected";
import {Unauthorized} from "@tsed/exceptions";


@Controller("/github")
@Name("Github")
export class Github {


	public constructor(
		private readonly githubService: GithubService,
		private readonly gitService: GitService
	) {

	}


	@Get("/users/:username")
	@Returns(200, Array).Of(String)
	@Protected()
	async getRepositories(
		@PathParams("username") username: string,
		@Req() {auth}: Express.Request
	) {
		if (username !== auth!.username) throw new Unauthorized(`You (${auth!.username}) are not ${username}`)

		return this.githubService.listRepos(username)
	}


	@Get("/users/:username/repositories/:repository/branches")
	@Returns(200, Array).Of(String)
	@Protected()
	async getBranchesForRepository(
		@PathParams("username") username: string,
		@PathParams("repository") repo: string,
		@Req() {auth}: Express.Request
	) {

		if (username !== auth!.username) throw new Unauthorized(`You (${auth!.username}) are not ${username}`)

		return this.githubService.listBranch(username, repo)
	}

	@Get("/users/:username/repositories/dockerfiles")
	@Returns(200, Array).Of(RepoWithBranchModel)
	@Protected()
	async getDockerRepository(
		@PathParams("username") username: string,
		@Req() {auth}: Express.Request
	) {

		if (username !== auth!.username) throw new Unauthorized(`You (${auth!.username}) are not ${username}`)

		return this.githubService.listReposWithDockerfile(username)
	}


	@Get("/users/:username/repositories/:repository/branches/:branch/dockerfiles")
	@Returns(200, Array).Of(FileModel)
	@Returns(Unauthorized.STATUS, Unauthorized)
	@Protected()
	async getDockerfilesForRepository(
		@PathParams("username") username: string,
		@PathParams("repository") repo: string,
		@PathParams("branch") branch: string,
		@Req() {auth}: Express.Request
	) {

		if (username !== auth!.username) throw new Unauthorized(`You (${auth!.username}) are not ${username}`)

		return this.gitService.getDockerfiles(username, repo, branch)
	}
}
