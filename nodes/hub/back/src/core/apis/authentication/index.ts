import { Service } from "@tsed/common";
import { AuthenticationApi as IAuthenticationApi, UsersApi } from "./generated";
import axios from "axios";
import { authorization_server_url } from "../../../config/authentication";

const instance = axios.create({
	withCredentials: true,
});

@Service()
export class AuthenticationApiClient {
	public readonly client: IAuthenticationApi;

	constructor() {
		this.client = new IAuthenticationApi(undefined, authorization_server_url, instance);
	}
}

@Service()
export class UsersApiClient {
	public readonly client: UsersApi;

	constructor() {
		this.client = new UsersApi(undefined, authorization_server_url, instance);
	}
}
