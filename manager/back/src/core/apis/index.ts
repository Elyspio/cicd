import {AuthenticationApi, UsersApi} from "./authentication";
import {Helper} from "../utils/helper";
import isDev = Helper.isDev;


const authenticationApi = isDev()
	? "http://localhost:4004"
	: "https://elyspio.fr/authentication"

export const Apis = {
	authentication: {
		login: new AuthenticationApi(undefined, authenticationApi),
		user: new UsersApi(undefined, authenticationApi)
	}
}
