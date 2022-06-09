import { Service } from "@tsed/common";
import { AuthenticationApi, AuthenticationAppApi } from "./generated";
import axios from "axios";
import { authorization_server_url } from "../../../config/authentication";

const instance = axios.create({
	withCredentials: true,
});

@Service()
export class AuthenticationApiClient {
	public readonly clients: {
		connection: AuthenticationApi;
		appConnection: AuthenticationAppApi;
	};

	constructor() {
		this.clients = {
			connection: new AuthenticationApi(undefined, authorization_server_url, instance),
			appConnection: new AuthenticationAppApi(undefined, authorization_server_url, instance),
		};
	}
}
