import {combineReducers, configureStore, getDefaultMiddleware} from "@reduxjs/toolkit";
import {reducer as themeReducer} from "./module/theme/reducer";
import {reducer as environmentReducer} from "./module/environments/reducer";
import {reducer as configReducer} from "./module/config/reducer";
import {automationReducer} from "./module/job/jobSplice";
import {createBrowserHistory} from 'history';
import {connectRouter, routerMiddleware} from 'connected-react-router'


export const history = createBrowserHistory();


export function configureCustomStore() {

    const reducers = {
        theme: themeReducer,
        environments: environmentReducer,
        automation: automationReducer,
        config: configReducer
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
