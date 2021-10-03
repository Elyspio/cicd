import * as path from "path";
import { $log } from "@tsed/common";
import { Helper } from "../core/utils/helper";
import isDev = Helper.isDev;

export const rootDir = path.resolve(__dirname, "..");

const frontPath = process.env.FRONT_PATH ?? path.resolve(rootDir, "..", "..", "..", "front", "build");

$log.info({ frontPath, rootDir });

export const allowedOrigins = isDev() ? ["http://127.0.0.1:3000", "http://localhost:3000", "http://localhost"] : ["https://elyspio.fr"];

export const webConfig: Partial<TsED.Configuration> = {
	rootDir,
	acceptMimes: ["application/json"],
	httpPort: process.env.HTTP_PORT || 4000,
	httpsPort: false, // CHANGE
	mount: {
		"/api": [`${rootDir}/web/controllers/**/*.ts`],
	},
	componentsScan: [`${rootDir}/core/**/*.ts`],
	exclude: ["**/*.spec.ts", "**/*.d.ts"],
	statics: {
		"/": [{ root: frontPath }],
	},
	swagger: [
		{
			path: "/swagger",
			options: {
				urls: [
					{
						name: process.env.NODE_ENV?.toString() ?? "development",
						url: isDev() ? "http://localhost:4000/swagger/swagger.json" : "https://elyspio.fr/cicd/swagger/swagger.json",
					},
				],
			},
			spec: {
				servers: [
					{
						description: process.env.NODE_ENV?.toString() ?? "development",
						url: isDev() ? "http://localhost:4000" : "https://elyspio.fr/cicd",
					},
				],
			},
			specVersion: "3.0.1",
			operationIdPattern: "%m",
		},
	],
	socketIO: {
		cors: {
			origin: true,
		},
		path: "/ws",
	},
};
