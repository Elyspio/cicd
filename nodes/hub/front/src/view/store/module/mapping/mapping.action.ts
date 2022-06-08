import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { container } from "../../../../core/di";
import { GithubService } from "../../../../core/services/cicd/github.cicd.service";
import { DiKeysService } from "../../../../core/di/di.keys.service";
import { AuthenticationEvents, AuthenticationService } from "../../../../core/services/authentication.service";
import store, { StoreState } from "../../index";
import { BuildDockerfileConfig, GitHubRepository } from "../../../../core/apis/backend/generated";
import { AutomateService } from "../../../../core/services/cicd/automate.cicd.service";

const githubService = container.get<GithubService>(DiKeysService.core.github);
const authenticationService = container.get<AuthenticationService>(DiKeysService.authentication);
const automateService = container.get<AutomateService>(DiKeysService.core.automate);

export const setDockerFileForRepo = createAction<GitHubRepository>("mapping/setDockerFileForRepo");

export const initMappingData = createAsyncThunk("mapping/init", async (_, thunkAPI) => {
	const username = await authenticationService.getUsername();

	const repos = await githubService.getRepositoriesData(username);

	await Promise.all(
		repos.map(async (repo) => {
			await thunkAPI.dispatch(setDockerFileForRepo(repo));
		}),
	);
});

export const createMapping = createAsyncThunk("mapping/create", async (_, { getState }) => {
	const {
		mapping: {
			selected: { source, build, deploy },
		},
	} = getState() as StoreState;

	const username = await authenticationService.getUsername();
	let dockerfiles: BuildDockerfileConfig | undefined = undefined;
	if (build.type === "dockerfiles") {
		dockerfiles = {
			username,
			files: build.dockerfiles
			            .filter((df) => df.dockerfile.use)
			            .map((df) => ({
				            workingDirectory: df.dockerfile.wd,
				            tag: df.dockerfile.tag,
				            path: df.dockerfile.path,
				            image: df.dockerfile.image,
			            })),
			platforms: build.dockerfiles[0].platforms,
		};
	}

	if ([source.branch, source.repo, deploy.dockerfilePath, deploy.url].some((x) => x === undefined)) {
		throw new Error("error createMapping: missing parameters");
	}

	await automateService.createMapping(
		{
			build: {
				bake: build.type === "bake" ? build.bake?.bakeFilePath : undefined,
				dockerfiles,
			},
			github: {
				repo: `https://github.com/${username}/${source.repo}.git`,
				branch: source.branch!,
			},
		},
		{
			agentUri: deploy.url!,
			dockerComposeFile: deploy.dockerfilePath!,
		},
	);
});

AuthenticationEvents.on("login", () => {
	store.dispatch(initMappingData() as any);
});
