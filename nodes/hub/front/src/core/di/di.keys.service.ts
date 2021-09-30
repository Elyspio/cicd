export const DiKeysService = {
	authentication: Symbol.for("AuthenticationService"),
	theme: Symbol.for("ThemeService"),
	localStorage: {
		settings: Symbol.for(
			"LocalStorageService:elyspio-authentication-settings",
		),
		validation: Symbol.for(
			"LocalStorageService:elyspio-authentication-validation",
		),
	},
	core: {
		docker: Symbol.for("DockerService"),
		github: Symbol.for("GithubService"),
		automate: Symbol.for("AutomateService"),
	},
};
