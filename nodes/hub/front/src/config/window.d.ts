declare global {
	interface Window {
		config: Config;
	}
}

export type Config = {
	endpoints: {
		core: {
			api: string;
			socket: string;
		};
		authentication: {
			api: string;
		};
	};
};
