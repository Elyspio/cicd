import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {ManagerConfigExport} from "../../../../../../back/src/core/services/manager/types";
import {managerSocket} from "../../../../core/services/socket";
import {events} from "../../../../config/events";
import store from "../../index";


const initialState: { config?: ManagerConfigExport } = {}

const slice = createSlice({
    initialState,
    reducers: {
        updateConfig: (state, action: PayloadAction<ManagerConfigExport>) => {
            state.config = action.payload
        }
    },
    name: "Automation",
    extraReducers: builder => {

    }
});

export const {reducer: automationReducer, actions: automationActions} = slice;


managerSocket.on(events.config.update, config => {
    store.dispatch(automationActions.updateConfig(config));
})
