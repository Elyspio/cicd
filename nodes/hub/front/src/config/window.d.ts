declare global {
	interface Window {
		config: Config;
	}
}

export type Config = {
	endpoints: {
		core: {
			api: string;
			socket: {
				namespace: string;
				hostname: string;
			};
		};
		authentication: {
			api: string;
		};
	};
};
