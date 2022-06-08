import { In, JsonParameterTypes, Returns } from "@tsed/schema";
import { UseAuth } from "@tsed/common";
import { useDecorators } from "@tsed/core";
import { authorization_cookie_token, authorization_header_app, authorization_header_token } from "../../config/authentication";
import { RequireAppLogin, RequireLogin } from "./authentication";
import { Unauthorized } from "@tsed/exceptions";
import { AppEnum } from "../../core/services/authentication.service";

const appsEnums: AppEnum[] = ["CICD"];

export function AppProtected(): Function {
	return useDecorators(
		UseAuth(RequireAppLogin),
		In(JsonParameterTypes.HEADER).Name(authorization_header_token).Type(String).Required(false),
		In(JsonParameterTypes.HEADER).Name(authorization_header_app).Type(String).Required(true).Schema({ enum: appsEnums }),
		Returns(401, Unauthorized).Description("You are not logged"),
	);
}


export function Protected(): Function {
	return useDecorators(
		UseAuth(RequireLogin),
		In(JsonParameterTypes.COOKIES).Name(authorization_cookie_token).Type(String).Required(false),
		In(JsonParameterTypes.HEADER).Name(authorization_header_token).Type(String).Required(false),
		Returns(401, Unauthorized).Description("You are not logged"),
	);
}
