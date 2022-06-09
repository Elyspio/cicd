import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { GithubService } from "../../../../core/services/cicd/github.cicd.service";
import { AuthenticationEvents, AuthenticationService } from "../../../../core/services/authentication.service";
import store, { ExtraArgument, StoreState } from "../../index";
import { BuildDockerfileConfig, GitHubRepository, Mapping } from "../../../../core/apis/backend/generated";
import { AutomateService } from "../../../../core/services/cicd/automate.cicd.service";
import { toast } from "react-toastify";


export const setDockerFileForRepo = createAction<GitHubRepository>("mapping/setDockerFileForRepo");

export const initMappingData = createAsyncThunk("mapping/init", async (_, { extra, dispatch }) => {
	const { container } = extra as ExtraArgument;
	const githubService = container.get(GithubService);
	const authenticationService = container.get(AuthenticationService);

	const username = await authenticationService.getUsername();

	const repos = await githubService.getRepositoriesData(username);

	await Promise.all(
		repos.map(async (repo) => {
			await dispatch(setDockerFileForRepo(repo));
		}),
	);
});

export const createMapping = createAsyncThunk("mapping/create", async (_, { getState, extra }) => {
	const {
		mapping: {
			selected: { source, build, deploy },
		},
	} = getState() as StoreState;

	const { container } = extra as ExtraArgument;
	const authenticationService = container.get(AuthenticationService);
	const automateService = container.get(AutomateService);

	const username = await authenticationService.getUsername();
	const credentials = await authenticationService.getCredentials(username);

	let dockerfiles: BuildDockerfileConfig | undefined = undefined;

	if (!credentials.github) {
		toast.error("Could not create mapping, no github credentials found");
		throw new Error("No github credentials found");
	}

	if (!credentials.docker) {
		toast.error("Could not create mapping, no docker credentials found");
		throw new Error("No docker credentials found");
	}

	if (build.type === "dockerfiles") {
		dockerfiles = {
			username: credentials.docker.username,
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

	await toast.promise(automateService.createMapping(
		{
			build: {
				bake: build.type === "bake" ? build.bake?.bakeFilePath : undefined,
				dockerfiles,
			},
			github: {
				repo: `https://github.com/${credentials.github.user}/${source.repo}.git`,
				branch: source.branch!,
			},
		},
		{
			agentUri: deploy.url!,
			dockerComposeFile: deploy.dockerfilePath!,
		},
	), {
		error: "Could not create mapping",
		success: "Mapping created",
		pending: "Creating mapping",
	});
});


export const runMapping = createAsyncThunk("mapping/run", async (id: Mapping["id"], { extra }) => {
	const { container } = extra as ExtraArgument;
	const mappingService = container.get(AutomateService);
	await toast.promise(mappingService.runMapping(id), {
		success: `Mapping ${id} run successfully`,
		pending: `Running mapping ${id}`,
		error: `Could not run mapping ${id}`,
	});
});


export const deleteMapping = createAsyncThunk("mapping/run", async (id: Mapping["id"], { extra }) => {
	const { container } = extra as ExtraArgument;
	const mappingService = container.get(AutomateService);
	await toast.promise(mappingService.deleteMapping(id), {
		success: `Mapping ${id} deleted successfully`,
		pending: `Deleting mapping ${id}`,
		error: `Could not delete mapping ${id}`,
	});
});


AuthenticationEvents.on("login", () => {
	store.dispatch(initMappingData() as any);
});
