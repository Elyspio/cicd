import { BodyParams, IMiddleware, Middleware, QueryParams, Req } from "@tsed/common";
import { Unauthorized } from "@tsed/exceptions";
import { Request } from "express";
import { authorization_cookie_token, authorization_header_app, authorization_header_token } from "../../config/authentication";
import { getLogger } from "../../core/utils/logger";
import { AuthenticationService } from "../../core/services/authentication.service";
import { Inject } from "@tsed/di";


class RequireBase {
	public static log = getLogger.middleware(RequireBase);

	@Inject()
	authenticationService!: AuthenticationService;

	private readonly mode: "app" | "user";


	constructor(mode: "app" | "user") {
		this.mode = mode;
	}

	protected async internal(req: Request, token: string | undefined, tokenBody: string | undefined) {
		const exception = new Unauthorized("You must be logged to access to this resource see https://elyspio.fr/authentication/");

		// Sanitize token param
		if (token === "") token = undefined;

		try {
			const cookieAuth = req.cookies[authorization_cookie_token];
			const headerToken = req.headers[authorization_header_token];

			const headerApp = req.headers[authorization_header_app] as string;

			RequireBase.log.info("RequireAppLogin", {
				cookieAuth,
				headerToken,
				uriToken: token,
			});

			token = token ?? cookieAuth;
			token = token ?? tokenBody;
			token = token ?? (headerToken as string);


			if (this.mode === "app") {
				if (await this.authenticationService.isAppAuthenticated(headerApp as any, token)) {
					req.auth = {
						token,
						app: headerApp,
					};
					return true;
				}
			}
			if (this.mode === "user") {
				if (await this.authenticationService.isAuthenticated(token)) {
					req.auth = {
						token,
					};
					return true;
				}
			}

			throw exception;
		} catch (e) {
			throw exception;
		}
	}
}


@Middleware()
export class RequireAppLogin extends RequireBase implements IMiddleware {
	constructor() {
		super("app");
	}

	public use(@Req() req: Request, @QueryParams("token") token?: string, @BodyParams("token") tokenBody?: string): any {
		return this.internal(req, token, tokenBody);
	}
}


@Middleware()
export class RequireLogin extends RequireBase implements IMiddleware {
	constructor() {
		super("user");
	}

	public use(@Req() req: Request, @QueryParams("token") token?: string, @BodyParams("token") tokenBody?: string): any {
		return this.internal(req, token, tokenBody);
	}
}

declare global {
	namespace Express {
		interface Request {
			auth?: {
				token: string;
				app?: string;
			};
		}
	}
}
