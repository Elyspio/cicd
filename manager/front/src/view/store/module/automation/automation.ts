import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ManagerConfigExport} from "../../../../../../back/src/core/services/manager/types";
import {createSocket} from "../../../../core/services/socket";
import {events} from "../../../../config/events";
import store from "../../index";
import {Deployment, DockerfilesParams} from "./types";


const initialState: {
	config?: ManagerConfigExport,
	sources: {
		repository?: string,
		branch?: string,
		username?: string
	}
	build: DockerfilesParams,
	deployments: Deployment[],
} = {
	sources: {},
	build: [],
	deployments: []
}

type State = typeof initialState

const slice = createSlice({
	initialState,
	reducers: {
		updateConfig: (state, action: PayloadAction<State["config"]>) => {
			state.config = action.payload
		},
		updateSources: ((state, action: PayloadAction<State["sources"]>) => {
			state.sources = action.payload;
		}),
		updateImages: ((state, action: PayloadAction<State["build"]>) => {
			state.build = action.payload;
		}),
	},
	name: "Automation",
	extraReducers: builder => {

	}
});

export const {reducer: automationReducer, actions: automationActions} = slice;


createSocket().on(events.config.update, config => {
	store.dispatch(automationActions.updateConfig(config));
});

