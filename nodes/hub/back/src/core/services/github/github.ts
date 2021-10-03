import { Inject, Service } from "@tsed/di";
import { GithubWrapper } from "./wrapper";
import { AuthenticationService } from "../authentication.service";
import { Log } from "../../utils/decorators/logger";
import { getLogger } from "../../utils/logger";

@Service()
export class GithubService {
	static errors = {
		noGithubToken: new Error("The authenticated user does not have a github entry in its credentials"),
	};

	private static log = getLogger.service(GithubService);

	private cache = new Map<string, GithubWrapper>();

	@Inject()
	private authenticationService: AuthenticationService;

	@Log(GithubService.log, { level: "debug", arguments: true })
	async get(username: string, authToken: string) {
		if (!this.cache.has(username)) {
			const { github } = await this.authenticationService.getCredentials(username, authToken);
			if (!github) throw GithubService.errors.noGithubToken;
			this.cache.set(username, new GithubWrapper(github.token));
		}
		return this.cache.get(username)!;
	}
}
