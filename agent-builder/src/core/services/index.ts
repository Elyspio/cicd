
import {Storage} from "./storage";
import {DockerService} from "./docker";

export const Services = {

    storage: new Storage(),
    docker: new DockerService()
}
