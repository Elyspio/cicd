import { Log } from "../utils/decorators/logger";
import { getLogger } from "../utils/logger";
import { Service } from "@tsed/common";
import { AuthenticationApi, AuthenticationAppApi } from "../apis/authentication/generated";
import { authorization_server_url } from "../../config/authentication";
import axios from "axios";

export type AppEnum = Parameters<AuthenticationAppApi["validToken"]>[0];

@Service()
export class AuthenticationService {
	private static log = getLogger.service(AuthenticationService);

	public readonly clients: {
		appConnection: AuthenticationAppApi,
		connection: AuthenticationApi,
	};

	constructor() {
		const instance = axios.create({ withCredentials: true });

		this.clients = {
			appConnection: new AuthenticationAppApi(undefined, authorization_server_url, instance),
			connection: new AuthenticationApi(undefined, authorization_server_url, instance),
		};
	}

	@Log(AuthenticationService.log, true, "debug")
	public async isAppAuthenticated(app: AppEnum, token: string) {
		return this.clients.appConnection.validToken(app, token).then((x) => x.data);
	}


	@Log(AuthenticationService.log, true, "debug")
	public async isAuthenticated(token: string) {
		return this.clients.connection.validToken(token).then((x) => x.data);
	}
}
