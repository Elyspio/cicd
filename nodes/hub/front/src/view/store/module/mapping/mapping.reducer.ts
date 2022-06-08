import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DockerfilesParams } from "../automation/types";
import { initMappingData, setDockerFileForRepo } from "./mapping.action";
import { BuildBakeConfig, GitHubRepository } from "../../../../core/apis/backend/generated";

export type MappingState = {
	repositories: Record<GitHubRepository["name"], GitHubRepository>;
	selected: {
		source: {
			repo?: string;
			branch?: string;
		};
		build: {
			dockerfiles: DockerfilesParams;
			bake?: BuildBakeConfig;
			type: "bake" | "dockerfiles";
		};
		deploy: {
			url?: string;
			dockerfilePath?: string;
		};
	};
	loading: boolean;
};
const initialState: MappingState = {
	repositories: {},
	selected: {
		source: {},
		build: {
			dockerfiles: [],
			type: "dockerfiles",
		},
		deploy: {},
	},
	loading: false,
};

const slice = createSlice({
	initialState,
	reducers: {
		setSelectedType: (state, action: PayloadAction<MappingState["selected"]["build"]["type"]>) => {
			state.selected.build.type = action.payload;
		},
		setSelectedRepo: (state, action: PayloadAction<string>) => {
			state.selected.source.repo = action.payload;
		},
		setSelectedBranch: (state, action: PayloadAction<string>) => {
			state.selected.source.branch = action.payload;
		},
		setDockerfiles: (state, action: PayloadAction<DockerfilesParams>) => {
			state.selected.build.dockerfiles = action.payload;
		},
		setBake: (state, action: PayloadAction<MappingState["selected"]["build"]["bake"]>) => {
			state.selected.build.bake = action.payload;
		},
		setSelectedDeploy: (state, action: PayloadAction<MappingState["selected"]["deploy"]>) => {
			state.selected.deploy = action.payload;
		},
	},
	name: "Mapping",
	extraReducers: (builder) => {
		builder.addCase(setDockerFileForRepo, (state, { payload }) => {
			if (state.repositories[payload.name] === undefined) {
				state.repositories[payload.name] = payload;
			}
		});

		builder.addCase(initMappingData.pending, (state) => {
			state.loading = true;
		});

		builder.addCase(initMappingData.fulfilled, (state) => {
			state.loading = false;
		});

		builder.addCase(initMappingData.rejected, (state) => {
			state.loading = false;
		});
	},
});

export const {
	reducer: mappingReducer,
	actions: { setSelectedRepo, setSelectedBranch, setDockerfiles, setBake, setSelectedType, setSelectedDeploy },
} = slice;
