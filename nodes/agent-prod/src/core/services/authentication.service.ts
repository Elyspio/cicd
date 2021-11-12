import { Log } from "../utils/decorators/logger";
import { getLogger } from "../utils/logger";
import { Service } from "@tsed/common";
import { AuthenticationAppApi } from "../apis/authentication/generated";
import { authorization_server_url } from "../../config/authentication";
import { globalConf } from "../../config/global";
import axios from "axios";

@Service()
export class AuthenticationService {
	private static log = getLogger.service(AuthenticationService);

	public readonly clients: {
		appConnection: AuthenticationAppApi;
	};

	constructor() {
		const instance = axios.create({ withCredentials: true });

		this.clients = {
			appConnection: new AuthenticationAppApi(undefined, authorization_server_url, instance),
		};
	}

	@Log(AuthenticationService.log, true, "debug")
	public async isAppAuthenticated(token: string) {
		return this.clients.appConnection.validToken(globalConf.hubAppName, { token }).then((x) => x.data);
	}
}
