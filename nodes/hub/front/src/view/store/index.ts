import {combineReducers, configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import {themeReducer} from "./module/theme/theme.reducer";
import {automationReducer} from "./module/automation/automation";
import {createBrowserHistory} from 'history';
import {connectRouter, routerMiddleware} from 'connected-react-router'
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {mappingReducer} from "./module/mapping/mapping.reducer";
import {authenticationReducer} from "./module/authentication/authentication.reducer";


export const history = createBrowserHistory({basename: process.env.NODE_ENV === "production" ? "/automate/cicd/hub/" : undefined});


export function configureCustomStore() {

	const reducers = {
		theme: themeReducer,
		automation: automationReducer,
		mapping: mappingReducer,
		authentication: authenticationReducer,
	};

	const middleware = [
		...getDefaultMiddleware(),
		routerMiddleware(history)
	];

	const rootReducer = combineReducers({
		...reducers,
		router: connectRouter(history),
	});

	return configureStore({
		reducer: rootReducer,
		middleware,
	});
}


export const store = configureCustomStore();

export type StoreState = ReturnType<typeof store.getState>

export default store;

export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<StoreState> = useSelector
