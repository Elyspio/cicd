import { Log } from "../utils/decorators/logger";
import { getLogger } from "../utils/logger";
import { AuthenticationApiClient, UsersApiClient } from "../apis/authentication";
import { Inject } from "@tsed/di";
import { Service } from "@tsed/common";

@Service()
export class AuthenticationService {

	private static log = getLogger.service(AuthenticationService);

	@Inject()
	private authenticationApi: AuthenticationApiClient;

	@Inject()
	private usersApi: UsersApiClient;

	@Log(AuthenticationService.log, { level: "debug", arguments: true })
	public async isAuthenticated(token: string) {
		return this.authenticationApi.client.validToken(token).then(x => x.data);
	}

	@Log(AuthenticationService.log, { level: "debug", arguments: true })
	public async getUsername(token: string) {
		return this.usersApi.client.getUserInfo("username", token, token).then(x => x.data);
	}

	@Log(AuthenticationService.log, { level: "debug", arguments: true })
	public async getCredentials(username: string, token: string) {
		return this.usersApi.client.getUserCredentials(username, token, token).then(x => x.data);
	}


}
