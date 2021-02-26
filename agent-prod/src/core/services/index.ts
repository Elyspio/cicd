import {BuilderAgentService} from "./prodAgent";
import {AuthenticationService} from "./authentication";

export const Services = {
    agent: new BuilderAgentService(),
    authentication: new AuthenticationService()
}
