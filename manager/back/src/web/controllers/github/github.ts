import {Controller, Get, PathParams, QueryParams, Req, UseBefore} from "@tsed/common";
import {Description, Name, Required, Returns} from "@tsed/schema";
import {Services} from "../../../core/services";
import * as Express from "express"
import {RequireLogin} from "../../middleware/authentication";
import {authorization_cookie_login} from "../../../config/authentication";
import {FileModel} from "./models";


@Controller("/github")
@Name("Github")
export class Github {
    @Get("/users/:username")
    @Returns(200, Array).Of(String)
    @UseBefore(RequireLogin)
    async getRepositories(
        @PathParams("username") username: string
    ) {
        return Services.github.remote.listRepos(username)
    }


    @Get("/users/:username/repositories/:repository/branches")
    @Returns(200, Array).Of(String)
    async getBranchesForRepository(
        @PathParams("username") username: string,
        @PathParams("repository") repo: string
    ) {
        return Services.github.remote.listBranch(username, repo)
    }

    @Get("/users/:username/repositories/:repository/branches/:branch/dockerfiles")
    @Returns(200, Array).Of(FileModel)
    async getDockerfilesForRepository(
        @PathParams("username") username: string,
        @PathParams("repository") repo: string,
        @PathParams("branch") branch: string
    ) {
        return Services.github.local.getDockerfiles(username, repo, branch)
    }


    @Get("/users")
    @Returns(200, String)
    @Description("")
    @UseBefore(RequireLogin)
    async getUsernameFromCookies(@Req() req: Express.Request) {
        if (process.env.NODE_ENV !== "production") return "Elyspio"
        const login = req.cookies[authorization_cookie_login]
        return login;
        // return Apis.authentication.user.usersGetUserKeys(login);
    }

}
