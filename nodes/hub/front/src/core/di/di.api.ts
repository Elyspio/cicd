import {DiKeysApi} from "./di.keys.api"
import {CicdApi} from "../apis/backend";
import {AuthenticationApi} from "../apis/authentication";
import {container} from "./index";


container
	.bind<CicdApi>(DiKeysApi.cicd)
	.to(CicdApi)

container
	.bind<AuthenticationApi>(DiKeysApi.authentication)
	.to(AuthenticationApi)

