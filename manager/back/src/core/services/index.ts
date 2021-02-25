import {AuthenticationService} from "./authentication";
import {StorageService} from "./storage";
import {ManagerService} from "./manager/manager";
import {DockerService} from "./docker";

export const Services = {
    authentication: new AuthenticationService(),
    storage: new StorageService(),
    manager: new ManagerService(),
    docker: new DockerService()
}
