import * as path from "path";


export const rootDir = path.resolve(__dirname, "..",);

export const webConfig: Partial<TsED.Configuration> = {
	rootDir,
	acceptMimes: ['application/json'],
	httpPort: process.env.HTTP_PORT || 4011,
	httpsPort: false, // CHANGE
	mount: {
		'/api': [
			`${rootDir}/web/controllers/**/*.ts`
		]
	},
	exclude: [
		'**/*.spec.ts'
	],
	swagger: [{
		path: "/swagger",
		specVersion: "3.0.1"
	}]
};
