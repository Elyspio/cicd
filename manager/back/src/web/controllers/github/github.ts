import {Controller, Get, PathParams, Req, UseBefore} from "@tsed/common";
import {Description, Name, Returns} from "@tsed/schema";
import * as Express from "express"
import {RequireLogin} from "../../middleware/authentication";
import {authorization_cookie_login} from "../../../config/authentication";
import {FileModel, RepoWithBranchModel} from "./models";
import {GithubService} from "../../../core/services/github/github";
import {GitService} from "../../../core/services/github/git";


@Controller("/github")
@Name("Github")
export class Github {


	public constructor(
		private readonly githubService: GithubService,
		private readonly gitService: GitService) {

	}


	@Get("/users/:username")
	@Returns(200, Array).Of(String)
	@UseBefore(RequireLogin)
	async getRepositories(
		@PathParams("username") username: string
	) {
		return this.githubService.listRepos(username)
	}


	@Get("/users/:username/repositories/:repository/branches")
	@Returns(200, Array).Of(String)
	async getBranchesForRepository(
		@PathParams("username") username: string,
		@PathParams("repository") repo: string
	) {
		return this.githubService.listBranch(username, repo)
	}

	@Get("/users/:username/repositories/docker")
	@Returns(200, Array).Of(RepoWithBranchModel)
	async getDockerRepository(
		@PathParams("username") username: string,
	) {
		return this.githubService.listReposWithDockerfile(username)
	}


	@Get("/users/:username/repositories/:repository/branches/:branch/dockerfiles")
	@Returns(200, Array).Of(FileModel)
	async getDockerfilesForRepository(
		@PathParams("username") username: string,
		@PathParams("repository") repo: string,
		@PathParams("branch") branch: string
	) {
		return this.gitService.getDockerfiles(username, repo, branch)
	}


	@Get("/users")
	@Returns(200, String)
	@Description("")
	@UseBefore(RequireLogin)
	async getUsernameFromCookies(@Req() req: Express.Request) {
		if (process.env.NODE_ENV !== "production") return "Elyspio"
		const login = req.cookies[authorization_cookie_login]
		return login;
		// return Apis.authentication.ts.user.usersGetUserKeys(login);
	}

}
