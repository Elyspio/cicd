import {combineReducers} from "redux";

import {reducer as themeReducer, ThemeState} from "./module/theme/reducer";
import {EnvironmentState, reducer as environmentReducer} from "./module/environments/reducer";

export interface RootState {
    theme: ThemeState;
    environments: EnvironmentState
}

export const rootReducer = combineReducers<RootState | undefined>({
    theme: themeReducer,
    environments: environmentReducer
});
