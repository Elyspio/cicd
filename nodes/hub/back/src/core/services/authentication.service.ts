import { Log } from "../utils/decorators/logger";
import { getLogger } from "../utils/logger";
import { AuthenticationApiClient } from "../apis/authentication";
import { Service } from "@tsed/common";
import { globalConf } from "../../config/global";

@Service()
export class AuthenticationService {
	private static log = getLogger.service(AuthenticationService);
	private apis: { authentication: AuthenticationApiClient };

	constructor(authenticationApi: AuthenticationApiClient) {
		this.apis = {
			authentication: authenticationApi,
		};
	}

	@Log(AuthenticationService.log)
	public async isAuthenticated(token: string) {
		return this.apis.authentication.clients.connection.validToken(token).then((x) => x.data);
	}

	@Log(AuthenticationService.log)
	public async getUsername(token: string) {
		return this.apis.authentication.clients.user.getUserInfo("username", token, token).then((x) => x.data);
	}

	@Log(AuthenticationService.log)
	public async getCredentials(username: string, token: string) {
		return this.apis.authentication.clients.credentials.get(username, token, token).then((x) => x.data);
	}

	@Log(AuthenticationService.log)
	public async createAppToken(userToken: string) {
		return this.apis.authentication.clients.appConnection.createAppToken(globalConf.appName, userToken).then((x) => x.data);
	}

	@Log(AuthenticationService.log)
	public async deleteAppToken(userToken: string, token: string) {
		return this.apis.authentication.clients.appConnection.deleteAppToken(globalConf.appName, { token }, userToken).then((x) => x.data);
	}
}
