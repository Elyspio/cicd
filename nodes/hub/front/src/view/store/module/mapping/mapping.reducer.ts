import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {DockerfilesParams} from "../automation/types";
import {initMappingData, setDockerFileForRepo} from "./mapping.action";
import {DockerBakeModel, RepoWithBranchModel} from "../../../../core/apis/backend/generated";


export type MappingState = {
	repositories: Record<RepoWithBranchModel["repo"], Record<RepoWithBranchModel["branch"], Omit<RepoWithBranchModel, "branch" | "repo">>>,
	selected: {
		repo?: string,
		branch?: string,
		dockerfiles: DockerfilesParams,
		bake?: DockerBakeModel,
		type: "bake" | "dockerfiles"
	},
	loading: boolean
};
const initialState: MappingState = {
	repositories: {},
	selected: {
		dockerfiles: [],
		type: "dockerfiles"
	},
	loading: false
}

const slice = createSlice({
	initialState,
	reducers: {
		setSelectedType: (state, action: PayloadAction<MappingState["selected"]["type"]>) => {
			state.selected.type = action.payload
		},
		setSelectedRepo: (state, action: PayloadAction<string>) => {
			state.selected.repo = action.payload;
		},
		setSelectedBranch: (state, action: PayloadAction<string>) => {
			state.selected.branch = action.payload;
		},
		setDockerfiles: (state, action: PayloadAction<DockerfilesParams>) => {
			state.selected.dockerfiles = action.payload;
		},
		setBake: (state, action: PayloadAction<MappingState["selected"]["bake"]>) => {
			state.selected.bake = action.payload;
		}
	},
	name: "Mapping",
	extraReducers: builder => {
		builder.addCase(setDockerFileForRepo, (state, {payload}) => {
			if (state.repositories[payload.repo] === undefined) {
				state.repositories[payload.repo] = {};
			}

			state.repositories[payload.repo][payload.branch] = {
				nodes: payload.nodes,
				dockerfiles: payload.dockerfiles,
				bake: payload.bake
			}
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


export const {reducer: mappingReducer, actions: {setSelectedRepo, setSelectedBranch, setDockerfiles, setBake, setSelectedType}} = slice;

