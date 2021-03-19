import {Apis} from "../apis";

export class AuthenticationService {

    public isAuthenticated = async (token: string) => {
        const result = await Apis.authentication.login.authenticationValidToken({token});
        return result.status === 204;
    }

}
