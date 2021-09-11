import {createReducer} from "@reduxjs/toolkit";
import {getUserInfos, logout} from "./authentication.action";
import {CredentialsModel, UserSettingsModel} from "../../../../core/apis/authentication/generated";

export interface AuthenticationState {
	logged: boolean,
	username?: string
	credentials?: CredentialsModel,
	settings?: UserSettingsModel
}

const defaultState: AuthenticationState = {
	logged: false,
};

export const authenticationReducer = createReducer(defaultState, (builder) => {
	builder.addCase(getUserInfos.fulfilled, (state, action) => {
		state.logged = true;
		state.credentials = action.payload.credentials
		state.username = action.payload.username;
		state.settings = action.payload.settings
	});


	builder.addCase(logout.fulfilled, state => {
		state.logged = defaultState.logged;
		state.credentials = defaultState.credentials;
		state.username = defaultState.username;
		state.settings = defaultState.settings;
	})
});
