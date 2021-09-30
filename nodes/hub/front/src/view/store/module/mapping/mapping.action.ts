import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { container } from "../../../../core/di";
import { GithubService } from "../../../../core/services/cicd/github.cicd.service";
import { DiKeysService } from "../../../../core/di/di.keys.service";
import { AuthenticationEvents, AuthenticationService } from "../../../../core/services/authentication.service";
import store, { StoreState } from "../../index";
import { DockerConfigModel, RepoWithBranchModel } from "../../../../core/apis/backend/generated";
import { AutomateService } from "../../../../core/services/cicd/automate.cicd.service";

const githubService = container.get<GithubService>(DiKeysService.core.github);
const authenticationService = container.get<AuthenticationService>(
	DiKeysService.authentication,
);
const automateService = container.get<AutomateService>(
	DiKeysService.core.automate,
);

export const setDockerFileForRepo = createAction<RepoWithBranchModel>(
	"mapping/setDockerFileForRepo",
);

export const initMappingData = createAsyncThunk(
	"mapping/init",
	async (_, thunkAPI) => {
		const username = await authenticationService.getUsername();

		const repos = await githubService.getRepositoriesData(username);

		await Promise.all(
			repos.map(async (repo) => {
				await thunkAPI.dispatch(setDockerFileForRepo(repo));
			}),
		);
	},
);

export const createMapping = createAsyncThunk(
	"mapping/create",
	async (_, { getState }) => {
		const {
			mapping: {
				selected: { source, build, deploy },
			},
		} = getState() as StoreState;

		let dockerfiles: DockerConfigModel | undefined = undefined;
		if (build.type === "dockerfiles") {
			const username = await authenticationService.getUsername();
			dockerfiles = {
				username,
				files: build.dockerfiles
				            .filter((df) => df.dockerfile.use)
				            .map((df) => ({
					            wd: df.dockerfile.wd,
					            tag: df.dockerfile.tag,
					            path: df.dockerfile.path,
					            image: df.dockerfile.image,
				            })),
				platforms: build.dockerfiles[0].platforms,
			};
		}

		if (
			[
				source.branch,
				source.repo,
				deploy.dockerfilePath,
				deploy.uri,
			].some((x) => x === undefined)
		)
			throw new Error("error createMapping: missing parameters");

		await automateService.createMapping(
			{
				build: {
					bake:
						build.type === "bake"
							? build.bake?.bakeFilePath
							: undefined,
					dockerfiles,
				},
				github: {
					repo: source.repo!,
					branch: source.branch!,
				},
			},
			{
				agentUri: deploy.uri!,
				dockerComposeFile: deploy.dockerfilePath!,
			},
		);
	},
);

AuthenticationEvents.on("login", () => {
	store.dispatch(initMappingData() as any);
});
