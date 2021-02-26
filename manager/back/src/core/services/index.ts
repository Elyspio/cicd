import {AuthenticationService} from "./authentication";
import {StorageService} from "./storage";
import {DockerService} from "./docker";
import {Base} from "./manager/base";
import {ManagerService} from "./manager/service";

export const Services = {
    authentication: new AuthenticationService(),
    storage: new StorageService(),
    manager: new ManagerService(),
    docker: new DockerService()
}
