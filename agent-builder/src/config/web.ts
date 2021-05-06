import * as path from "path";


export const rootDir = path.resolve(__dirname, "..",);

export const webConfig: Partial<TsED.Configuration> = {
	rootDir,
	acceptMimes: ['application/json'],
	httpPort: process.env.HTTP_PORT || 4001,
	httpsPort: false, // CHANGE
	// mount: {
	// 	'/core': [
	// 		`${rootDir}/web/controllers/**/*.ts`
	// 	]
	// },
	exclude: [
		'**/*.spec.ts'
	],
	swagger: [{
		path: "/swagger",
		specVersion: "3.0.1"
	}]
};
