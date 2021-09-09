import {createAction, createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Apis} from "../../../../core/apis";
import {DockerfilesParams} from "../automation/types";


const setDockerFileForRepo = createAction<{ repo: string, branch: string, dockerfiles: string[] }>("mapping/setDockerFileForRepo")

export const initMappingData = createAsyncThunk("mapping/init", async (nothing, thunkAPI) => {

	const username = (await Apis.core.github.githubGetUsernameFromCookies()).data
	const repos = (await Apis.core.github.githubGetRepositories(username)).data
	await Promise.all(repos.map(async repo => {
		const branches = (await Apis.core.github.githubGetBranchesForRepository(username, repo)).data
		await Promise.all(branches.map(async branch => {
			const dockerfiles = (await Apis.core.github.githubGetDockerfilesForRepository(username, repo, branch)).data
			if (dockerfiles.length > 0) {
				thunkAPI.dispatch(setDockerFileForRepo({
					repo, branch, dockerfiles: dockerfiles.map(x => x.path)
				}))
			}

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


