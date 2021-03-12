import {configureStore} from "@reduxjs/toolkit";
import {reducer as themeReducer} from "./module/theme/reducer";
import {reducer as environmentReducer} from "./module/environments/reducer";
import {automationReducer} from "./module/job/jobSplice";

const store = configureStore({
    reducer: {
        theme: themeReducer,
        environments: environmentReducer,
        automation: automationReducer
    },
});

export default store;

export type StoreState = ReturnType<typeof store.getState>
