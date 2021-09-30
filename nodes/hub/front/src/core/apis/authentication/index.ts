import { injectable } from "inversify";
import { AuthenticationApi as baseAuth, UsersApi } from "./generated";
import axios from "axios";

const instance = axios.create({
	withCredentials: true,
});

@injectable()
export class AuthenticationApi {
	public readonly clients = {
		login: new baseAuth(
			undefined,
			window.config.endpoints.authentication.api,
			instance,
		),
		user: new UsersApi(
			undefined,
			window.config.endpoints.authentication.api,
			instance,
		),
	};
}
