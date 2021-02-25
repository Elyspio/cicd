import {BuilderAgentService} from "./builderAgent";
import {AuthenticationService} from "./authentication";

export const Services = {
    agent: new BuilderAgentService(),
    authentication: new AuthenticationService()
}
