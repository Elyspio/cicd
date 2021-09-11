import {AuthenticationService} from "../services/authentication.service";
import {ThemeService} from "../services/theme.service";
import {LocalStorageService} from "../services/localStorage.service";
import {DiKeysService} from "./di.keys.service"
import {container} from "./index";
import {AutomateService} from "../services/cicd/automate.cicd.service";
import {DockerService} from "../services/cicd/docker.cicd.service";
import {GithubService} from "../services/cicd/github.cicd.service";

container
	.bind<AuthenticationService>(DiKeysService.authentication)
	.to(AuthenticationService)

container
	.bind<ThemeService>(DiKeysService.theme)
	.to(ThemeService)

container
	.bind<AutomateService>(DiKeysService.core.automate)
	.to(AutomateService)

container
	.bind<GithubService>(DiKeysService.core.github)
	.to(GithubService)

container
	.bind<DockerService>(DiKeysService.core.docker)
	.to(DockerService)

container
	.bind<LocalStorageService>(DiKeysService.localStorage.settings)
	.toConstantValue(new LocalStorageService("elyspio-authentication-settings"))

container
	.bind<LocalStorageService>(DiKeysService.localStorage.validation)
	.toConstantValue(new LocalStorageService("elyspio-authentication-validation"))
