import {In, JsonParameterTypes, Returns} from "@tsed/schema";
import {UseAuth} from "@tsed/common";
import {useDecorators} from "@tsed/core";
import {authorization_cookie_token} from "../../config/authentication";
import {RequireLogin} from "./authentication";
import {Forbidden} from "@tsed/exceptions/lib/clientErrors"

export function Protected(): Function {
	return useDecorators(
		UseAuth(RequireLogin),
		In(JsonParameterTypes.HEADER).Name(authorization_cookie_token).Type(String).Required(false),
		In(JsonParameterTypes.COOKIES).Name(authorization_cookie_token).Type(String).Required(false),
		Returns(403, Forbidden).Description("You are not logged")
	);
}
