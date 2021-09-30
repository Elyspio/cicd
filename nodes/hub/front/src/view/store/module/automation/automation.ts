import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { events } from "../../../../config/events";
import store from "../../index";
import { DockerfilesParams } from "./types";
import { createSocket } from "../../../../core/services/cicd/cicd.socket";
import { HubConfig, MappingModel } from "../../../../core/apis/backend/generated";

const initialState: {
	config?: HubConfig;
	sources: {
		repository?: string;
		branch?: string;
		username?: string;
	};
	build: DockerfilesParams;
	mappings: MappingModel[];
} = {
	sources: {},
	build: [],
	mappings: [],
};

export type AutomationState = typeof initialState;

const slice = createSlice({
	initialState,
	reducers: {
		updateConfig: (
			state,
			action: PayloadAction<AutomationState["config"]>,
		) => {
			state.config = action.payload;
		},
		updateSources: (
			state,
			action: PayloadAction<AutomationState["sources"]>,
		) => {
			state.sources = action.payload;
		},
		updateImages: (
			state,
			action: PayloadAction<AutomationState["build"]>,
		) => {
			state.build = action.payload;
		},
	},
	name: "Automation",
	extraReducers: (builder) => {
	},
});

export const { reducer: automationReducer, actions: automationActions } = slice;

createSocket().on(events.config.update, (config) => {
	store.dispatch(automationActions.updateConfig(config));
});
