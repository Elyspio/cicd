import {BuilderAgentService} from "./builderAgent";
import {AuthenticationService} from "./authentication";
import {StorageService} from "./storage";

export const Services = {
    agent: new BuilderAgentService(),
    authentication: new AuthenticationService(),
    storage: new StorageService()
}
