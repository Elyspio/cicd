import {createReducer} from "@reduxjs/toolkit";
import {setEndpoints, setEnvironment} from "./action";
import store from "../../index";

const xhr = new XMLHttpRequest()

const url = process.env.NODE_ENV === "production"
	? "https://elyspio.fr/automate/cicd/manager/conf.json"
	: "/automate/cicd/manager/conf.json"
xhr.open("GET", url, false)
xhr.send()


export const initConf: ConfigState = JSON.parse(xhr.responseText)

export function getEnv(name: keyof ConfigState["envs"]): string {
	return store?.getState().config.envs[name] ?? defaultState.envs[name]
}

export function getEndpoint(name: keyof ConfigState["endpoints"]) {
	return store?.getState().config.endpoints[name] ?? defaultState.endpoints[name]
}

export interface ConfigState {
	envs: { [key in string]: string },
	endpoints: {
		core: {
			api: string
			socket: {
				path: string;
				scheme: string;
				namespace: string,
				hostname: string
			},
		}
	}
}

const defaultState: ConfigState = {
	envs: {},
	endpoints: {
		core: initConf.endpoints.core
	}
};

export const reducer = createReducer(defaultState, ({addCase}) => {
	addCase(setEnvironment, (state, action) => {
		state.envs = action.payload;
	})
	addCase(setEndpoints, (state, action) => {
		state.endpoints = action.payload;
	})
});
