import {createAction, createAsyncThunk} from "@reduxjs/toolkit";
import {container} from "../../../../core/di";
import {GithubService} from "../../../../core/services/cicd/github.cicd.service";
import {DiKeysService} from "../../../../core/di/di.keys.service";
import {AuthenticationEvents, AuthenticationService} from "../../../../core/services/authentication.service";
import store from "../../index";
import {RepoWithBranchModel} from "../../../../core/apis/backend/generated";

const githubService = container.get<GithubService>(DiKeysService.core.github)
const authenticationService = container.get<AuthenticationService>(DiKeysService.authentication)

export const setDockerFileForRepo = createAction<RepoWithBranchModel>("mapping/setDockerFileForRepo")

export const initMappingData = createAsyncThunk("mapping/init", async (_, thunkAPI) => {
	const username = await authenticationService.getUsername();

	const repos = await githubService.getRepositoriesData(username);

	await Promise.all(repos.map(async (repo) => {
		await thunkAPI.dispatch(setDockerFileForRepo(repo))
	}))
})


AuthenticationEvents.on("login", () => {
	store.dispatch(initMappingData() as any)
})
