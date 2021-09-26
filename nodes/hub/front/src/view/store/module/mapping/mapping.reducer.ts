import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {DockerfilesParams} from "../automation/types";
import {initMappingData, setDockerFileForRepo} from "./mapping.action";
import {BakeBuild} from "../../../../../../back/src/core/services/hub/types";


export type MappingState = {
	repositories: { [key in string]: { [key in string]: string[] } },
	selected: {
		repo?: string,
		branch?: string,
		dockerfiles: DockerfilesParams,
		bake?: BakeBuild
	},
	loading: boolean
};
const initialState: MappingState = {
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


export const {reducer: mappingReducer, actions: {setSelectedRepo, setSelectedBranch, setDockerfiles, setBake}} = slice;

