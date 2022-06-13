import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { events } from "../../../../config/events";
import store from "../../index";
import { createSocket } from "../../../../core/services/cicd/cicd.socket";
import { HubConfig, ProductionApps } from "../../../../core/apis/backend/generated";
import { getProductionApps } from "./automation.action";

const initialState: {
	config: HubConfig;
	productionApps: ProductionApps[]
} = {
	config: {
		agents: {
			builds: [],
			deploys: [],
		},
		jobs: {
			builds: [],
			deploys: [],
		},
		queues: {
			builds: [],
			deploys: [],
		},
		mappings: [],
	},
	productionApps: [],
};

export type AutomationState = typeof initialState;

const slice = createSlice({
	initialState,
	reducers: {
		updateConfig: (state, action: PayloadAction<AutomationState["config"]>) => {
			state.config = action.payload;
		},
	},
	name: "Automation",
	extraReducers: (builder) => {
		builder.addCase(getProductionApps.fulfilled, (state, action) => {
			state.productionApps = action.payload;
		});
	},
});

export const { reducer: automationReducer, actions: automationActions } = slice;

let hubConnection = createSocket();
hubConnection.on(events.config.update, (config) => {
	store.dispatch(automationActions.updateConfig(config));
});
