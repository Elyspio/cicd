import { Controller, Get, PathParams, Req } from "@tsed/common";
import { Name, Returns } from "@tsed/schema";
import * as Express from "express";
import { FileModel, RepoWithBranchModel } from "./models";
import { GithubService } from "../../../core/services/github/github";
import { Protected } from "../../middleware/protected";
import { Unauthorized } from "@tsed/exceptions";

@Controller("/github")
@Name("Github.Users")
export class UsersGithubController {
	public constructor(private readonly githubService: GithubService) {}

	@Get("/users/:username")
	@(Returns(200, Array).Of(String))
	@Protected()
	async getRepositories(@PathParams("username") username: string, @Req() { auth }: Express.Request) {
		if (username !== auth!.username) throw new Unauthorized(`You (${auth!.username}) are not ${username}`);

		const service = await this.githubService.get(username, auth!.token);

		return service.listRepos(username);
	}

	@Get("/users/:username/repositories/:repository/branches")
	@(Returns(200, Array).Of(String))
	@Protected()
	async getBranchesForRepository(@PathParams("username") username: string, @PathParams("repository") repo: string, @Req() { auth }: Express.Request) {
		if (username !== auth!.username) throw new Unauthorized(`You (${auth!.username}) are not ${username}`);

		const service = await this.githubService.get(username, auth!.token);

		return service.listBranch(username, repo);
	}

	@Get("/users/:username/repositories/dockerfiles")
	@(Returns(200, Array).Of(RepoWithBranchModel))
	@(Returns(Unauthorized.STATUS, Unauthorized).Description("if usernames in cookies and in uri do not match"))
	@Protected()
	async getDockerRepository(@PathParams("username") username: string, @Req() { auth }: Express.Request) {
		if (username !== auth!.username) throw new Unauthorized(`You (${auth!.username}) are not ${username}`);

		const service = await this.githubService.get(username, auth!.token);

		return service.listReposWithAllData(username);
	}

	@Get("/users/:username/repositories/:repository/branches/:branch/dockerfiles")
	@(Returns(200, Array).Of(FileModel))
	@Returns(Unauthorized.STATUS, Unauthorized)
	@Protected()
	async getDockerfilesForRepository(@PathParams("username") username: string, @PathParams("repository") repo: string, @PathParams("branch") branch: string, @Req() { auth }: Express.Request) {
		if (username !== auth!.username) throw new Unauthorized(`You (${auth!.username}) are not ${username}`);

		const service = await this.githubService.get(username, auth!.token);

		return service.parseRepoTree(username, repo, branch);
	}
}
