import {Apis} from "../apis";
import {Api} from "../apis/api";
import {getLoginPage} from "../../config/apis/authentication";

export class AuthenticationService {

    async login() {
        try {
            const valid = await Apis.authentication.login.authenticationValidToken()
            if (!valid) {
                Api.redirect(getLoginPage())
            }

        } catch (e) {
            Api.redirect(getLoginPage())
        }

    }

}
