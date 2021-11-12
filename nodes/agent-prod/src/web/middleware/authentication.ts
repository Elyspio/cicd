import { BodyParams, IMiddleware, Middleware, QueryParams, Req } from "@tsed/common";
import { Unauthorized } from "@tsed/exceptions";
import { Request } from "express";
import { authorization_cookie_token, authorization_header_token } from "../../config/authentication";
import { getLogger } from "../../core/utils/logger";
import { AuthenticationService } from "../../core/services/authentication.service";
import { Inject } from "@tsed/di";

@Middleware()
export class RequireAppLogin implements IMiddleware {
	private static log = getLogger.middleware(RequireAppLogin);

	@Inject()
	authenticationService!: AuthenticationService;

	public async use(@Req() req: Request, @QueryParams("token") token?: string, @BodyParams("token") tokenBody?: string) {
		const exception = new Unauthorized("You must be logged to access to this resource see https://elyspio.fr/authentication/");

		// Sanitize token param
		if (token === "") token = undefined;

		try {
			const cookieAuth = req.cookies[authorization_cookie_token];
			const headerToken = req.headers[authorization_header_token];

			RequireAppLogin.log.info("RequireAppLogin", {
				cookieAuth,
				headerToken,
				uriToken: token,
			});

			token = token ?? cookieAuth;
			token = token ?? tokenBody;
			token = token ?? (headerToken as string);

			if (await this.authenticationService.isAppAuthenticated(token)) {
				req.auth = {
					token,
				};
				return true;
			} else throw exception;
		} catch (e) {
			throw exception;
		}
	}
}

declare global {
	namespace Express {
		interface Request {
			auth?: {
				token: string;
			};
		}
	}
}
