import {createAction, createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {DockerfilesParams} from "../automation/types";
import {container} from "../../../../core/di";
import {DiKeysService} from "../../../../core/di/di.keys.service";
import {GithubService} from "../../../../core/services/cicd/github.cicd.service";
import {AuthenticationService} from "../../../../core/services/authentication.service";

const githubService = container.get<GithubService>(DiKeysService.core.github)
const authenticationService = container.get<AuthenticationService>(DiKeysService.authentication)

const setDockerFileForRepo = createAction<{ repo: string, branch: string, dockerfiles: string[] }>("mapping/setDockerFileForRepo")

export const initMappingData = createAsyncThunk("mapping/init", async (nothing, thunkAPI) => {
	const username = await authenticationService.getUsername();

	const repos = await githubService.getRepositoriesData(username);

	await Promise.all(repos.map(async (repo) => {
		await thunkAPI.dispatch(setDockerFileForRepo({
			repo: repo.repo,
			branch: repo.branch,
			dockerfiles: repo.dockerfiles
		}))
	}))
})


const initialState: {
	repositories: { [key in string]: { [key in string]: string[] } },
	selected: {
		repo?: string,
		branch?: string,
		dockerfiles: DockerfilesParams,
	},
	loading: boolean
} = {
	repositories: {},
	selected: {
		dockerfiles: [],
	},
	loading: false
}

const slice = createSlice({
	initialState,
	reducers: {
		setSelectedRepo: (state, action: PayloadAction<string>) => {
			state.selected.repo = action.payload;
		},
		setSelectedBranch: (state, action: PayloadAction<string>) => {
			state.selected.branch = action.payload;
		},
		setDockerfiles: (state, action: PayloadAction<DockerfilesParams>) => {
			state.selected.dockerfiles = action.payload;
		}
	},
	name: "Mapping",
	extraReducers: builder => {
		builder.addCase(setDockerFileForRepo, (state, {payload}) => {
			if (state.repositories[payload.repo] === undefined) {
				state.repositories[payload.repo] = {};
			}

			if (state.repositories[payload.repo][payload.branch] === undefined) {
				state.repositories[payload.repo][payload.branch] = [];
			}

			state.repositories[payload.repo][payload.branch] = [...state.repositories[payload.repo][payload.branch], ...payload.dockerfiles];
		})


		builder.addCase(initMappingData.pending, state => {
			state.loading = true;
		})

		builder.addCase(initMappingData.fulfilled, state => {
			state.loading = false;
		})

		builder.addCase(initMappingData.rejected, state => {
			state.loading = false;
		})
	}
});

export const {reducer: mappingReducer, actions: {setSelectedRepo, setSelectedBranch, setDockerfiles}} = slice;


