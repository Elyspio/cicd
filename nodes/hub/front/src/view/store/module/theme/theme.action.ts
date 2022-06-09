import { createAction as _createAction } from "@reduxjs/toolkit";
import store from "../../index";
import { container } from "../../../../core/di";
import { AuthenticationEvents, AuthenticationService } from "../../../../core/services/authentication.service";

const createAction = <T>(name: string) => _createAction<T>(`theme/${name}`);

export const setTheme = createAction<"dark" | "light">("set");
export const toggleTheme = createAction<void>("toggle");

const authentication = container.get(AuthenticationService);

AuthenticationEvents.on("login", async (username) => {
	const theme = await authentication.getUserTheme(username);
	store.dispatch(setTheme(theme));
});
