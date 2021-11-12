import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { events } from "../../../../config/events";
import store from "../../index";
import { createSocket } from "../../../../core/services/cicd/cicd.socket";
import { HubConfig } from "../../../../core/apis/backend/generated";

const initialState: {
	config?: HubConfig;
} = {};

export type AutomationState = typeof initialState;

const slice = createSlice({
	initialState,
	reducers: {
		updateConfig: (state, action: PayloadAction<AutomationState["config"]>) => {
			state.config = action.payload;
		},
	},
	name: "Automation",
});

export const { reducer: automationReducer, actions: automationActions } = slice;

createSocket().on(events.config.update, (config) => {
	store.dispatch(automationActions.updateConfig(config));
});
