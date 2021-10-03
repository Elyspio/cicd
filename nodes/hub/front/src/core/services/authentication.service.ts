import { openPage } from "../utils/web";
import { inject, injectable } from "inversify";
import { ThemeService } from "./theme.service";
import { DiKeysService } from "../di/di.keys.service";
import { AuthenticationApi } from "../apis/authentication";
import { DiKeysApi } from "../di/di.keys.api";
import { EventManager } from "../utils/event";

@injectable()
export class AuthenticationService {
	@inject(DiKeysService.theme)
	private themeService!: ThemeService;

	@inject(DiKeysApi.authentication)
	private authenticationApi!: AuthenticationApi;

	public openLoginPage() {
		return openPage(window.config.endpoints.authentication.api);
	}

	public getUsername() {
		return this.authenticationApi.clients.user.getUserInfo("username").then((x) => x.data);
	}

	public getToken() {
		return this.authenticationApi.clients.user.getUserInfo("token").then((x) => x.data);
	}

	public getCredentials(username: string) {
		return this.authenticationApi.clients.user.getUserCredentials(username).then((x) => x.data);
	}

	public getSettings(username: string) {
		return this.authenticationApi.clients.user.getUserSettings(username).then((x) => x.data);
	}

	public async getUserTheme(username: string) {
		let theme = await this.themeService.getThemeFromSystem();
		return this.authenticationApi.clients.user.getUserTheme(username, theme).then((x) => x.data.theme);
	}

	public isLogged() {
		return this.authenticationApi.clients.login.validToken().then((x) => x.data);
	}

	public async logout() {
		await this.authenticationApi.clients.login.logout();
	}
}

export const AuthenticationEvents = new EventManager<{
	login: (username: string) => void;
	logout: () => void;
}>();
