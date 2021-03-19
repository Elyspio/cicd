import {AuthenticationService} from "./authentication";
import {StorageService} from "./storage";
import {DockerService} from "./docker/docker";
import {ManagerService} from "./manager/service";
import {GithubService} from "./github/github";
import {GitService} from "./github/git";

export const Services = {
    authentication: new AuthenticationService(),
    storage: new StorageService(),
    manager: new ManagerService(),
    docker: new DockerService(),
    github: {
        remote: new GithubService(),
        local: new GitService()
    }
}
