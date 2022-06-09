import { AuthenticationService } from "../services/authentication.service";
import { ThemeService } from "../services/theme.service";
import { LocalStorageService } from "../services/localStorage.service";
import { DiKeysService } from "./di.keys.service";
import { container } from "./index";
import { AutomateService } from "../services/cicd/automate.cicd.service";
import { DockerService } from "../services/cicd/docker.cicd.service";
import { GithubService } from "../services/cicd/github.cicd.service";


container.bind(AuthenticationService).toSelf();
container.bind(ThemeService).toSelf();
container.bind(AutomateService).toSelf();
container.bind(DockerService).toSelf();
container.bind(GithubService).toSelf();


container.bind<LocalStorageService>(DiKeysService.localStorage.settings).toConstantValue(new LocalStorageService("elyspio-authentication-settings"));

container.bind<LocalStorageService>(DiKeysService.localStorage.validation).toConstantValue(new LocalStorageService("elyspio-authentication-validation"));
