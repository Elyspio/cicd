/* tslint:disable */
/* eslint-disable */
/**
 * Api documentation
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { Configuration } from "./configuration";
import globalAxios, { AxiosInstance, AxiosPromise, AxiosRequestConfig } from "axios";
// Some imports not used depending on template conditions
// @ts-ignore
import { assertParamExists, createRequestFunction, DUMMY_BASE_URL, serializeDataIfNeeded, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, toPathString } from "./common";
// @ts-ignore
import { BASE_PATH, BaseAPI, COLLECTION_FORMATS, RequestArgs, RequiredError } from "./base";

/**
 *
 * @export
 * @interface DeployConfigModel
 */
export interface DeployConfigModel {
	/**
	 *
	 * @type {DockerField}
	 * @memberof DeployConfigModel
	 */
	docker: DockerField;
	/**
	 * URI of the production agent
	 * @type {string}
	 * @memberof DeployConfigModel
	 */
	uri: string;
}

/**
 *
 * @export
 * @interface DeployJobModel
 */
export interface DeployJobModel {
	/**
	 * Job id
	 * @type {number}
	 * @memberof DeployJobModel
	 */
	id: number;
	/**
	 *
	 * @type {string}
	 * @memberof DeployJobModel
	 */
	stdout: string | null;
	/**
	 *
	 * @type {string}
	 * @memberof DeployJobModel
	 */
	error: string | null;
	/**
	 *
	 * @type {DeployConfigModel}
	 * @memberof DeployJobModel
	 */
	config?: DeployConfigModel;
}

/**
 *
 * @export
 * @interface DockerComposeField
 */
export interface DockerComposeField {
	/**
	 * Path where the docker-compose.yml file is
	 * @type {string}
	 * @memberof DockerComposeField
	 */
	path?: string;
}

/**
 *
 * @export
 * @interface DockerField
 */
export interface DockerField {
	/**
	 *
	 * @type {DockerComposeField}
	 * @memberof DockerField
	 */
	compose?: DockerComposeField;
}

/**
 *
 * @export
 * @interface GenericError
 */
export interface GenericError {
	/**
	 * The error name
	 * @type {string}
	 * @memberof GenericError
	 */
	name: string;
	/**
	 * An error message
	 * @type {string}
	 * @memberof GenericError
	 */
	message: string;

	[key: string]: object | any;
}

/**
 *
 * @export
 * @interface Unauthorized
 */
export interface Unauthorized {
	/**
	 * The error name
	 * @type {string}
	 * @memberof Unauthorized
	 */
	name: string;
	/**
	 * An error message
	 * @type {string}
	 * @memberof Unauthorized
	 */
	message: string;
	/**
	 * The status code of the exception
	 * @type {number}
	 * @memberof Unauthorized
	 */
	status: number;
	/**
	 * A list of related errors
	 * @type {Array<GenericError>}
	 * @memberof Unauthorized
	 */
	errors?: Array<GenericError>;
	/**
	 * The stack trace (only in development mode)
	 * @type {string}
	 * @memberof Unauthorized
	 */
	stack?: string;
}

/**
 * AutomateApi - axios parameter creator
 * @export
 */
export const AutomateApiAxiosParamCreator = function (configuration?: Configuration) {
	return {
		/**
		 * Fetch the list of docker-compose.yml files
		 * @param {string} [authenticationToken]
		 * @param {string} [authenticationToken2]
		 * @param {*} [options] Override http request option.
		 * @throws {RequiredError}
		 */
		getApps: async (authenticationToken?: string, authenticationToken2?: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
			const localVarPath = `/api/automate/node`;
			// use dummy base URL string because the URL constructor only accepts absolute URLs.
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) {
				baseOptions = configuration.baseOptions;
			}

			const localVarRequestOptions = { method: "GET", ...baseOptions, ...options };
			const localVarHeaderParameter = {} as any;
			const localVarQueryParameter = {} as any;

			if (authenticationToken !== undefined && authenticationToken !== null) {
				localVarHeaderParameter["authentication-token"] = String(authenticationToken);
			}

			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };

			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions,
			};
		},
	};
};

/**
 * AutomateApi - functional programming interface
 * @export
 */
export const AutomateApiFp = function (configuration?: Configuration) {
	const localVarAxiosParamCreator = AutomateApiAxiosParamCreator(configuration);
	return {
		/**
		 * Fetch the list of docker-compose.yml files
		 * @param {string} [authenticationToken]
		 * @param {string} [authenticationToken2]
		 * @param {*} [options] Override http request option.
		 * @throws {RequiredError}
		 */
		async getApps(authenticationToken?: string, authenticationToken2?: string, options?: AxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<string>>> {
			const localVarAxiosArgs = await localVarAxiosParamCreator.getApps(authenticationToken, authenticationToken2, options);
			return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
		},
	};
};

/**
 * AutomateApi - factory interface
 * @export
 */
export const AutomateApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
	const localVarFp = AutomateApiFp(configuration);
	return {
		/**
		 * Fetch the list of docker-compose.yml files
		 * @param {string} [authenticationToken]
		 * @param {string} [authenticationToken2]
		 * @param {*} [options] Override http request option.
		 * @throws {RequiredError}
		 */
		getApps(authenticationToken?: string, authenticationToken2?: string, options?: any): AxiosPromise<Array<string>> {
			return localVarFp.getApps(authenticationToken, authenticationToken2, options).then((request) => request(axios, basePath));
		},
	};
};

/**
 * AutomateApi - object-oriented interface
 * @export
 * @class AutomateApi
 * @extends {BaseAPI}
 */
export class AutomateApi extends BaseAPI {
	/**
	 * Fetch the list of docker-compose.yml files
	 * @param {string} [authenticationToken]
	 * @param {string} [authenticationToken2]
	 * @param {*} [options] Override http request option.
	 * @throws {RequiredError}
	 * @memberof AutomateApi
	 */
	public getApps(authenticationToken?: string, authenticationToken2?: string, options?: AxiosRequestConfig) {
		return AutomateApiFp(this.configuration)
			.getApps(authenticationToken, authenticationToken2, options)
			.then((request) => request(this.axios, this.basePath));
	}
}

/**
 * ProductionAgentApi - axios parameter creator
 * @export
 */
export const ProductionAgentApiAxiosParamCreator = function (configuration?: Configuration) {
	return {
		/**
		 * Deploy a project following a configuration
		 * @param {DeployJobModel} deployJobModel
		 * @param {string} [authenticationToken]
		 * @param {string} [authenticationToken2]
		 * @param {*} [options] Override http request option.
		 * @throws {RequiredError}
		 */
		build: async (deployJobModel: DeployJobModel, authenticationToken?: string, authenticationToken2?: string, options: AxiosRequestConfig = {}): Promise<RequestArgs> => {
			// verify required parameter 'deployJobModel' is not null or undefined
			assertParamExists("build", "deployJobModel", deployJobModel);
			const localVarPath = `/api/production-agent/deploy`;
			// use dummy base URL string because the URL constructor only accepts absolute URLs.
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) {
				baseOptions = configuration.baseOptions;
			}

			const localVarRequestOptions = { method: "POST", ...baseOptions, ...options };
			const localVarHeaderParameter = {} as any;
			const localVarQueryParameter = {} as any;

			if (authenticationToken !== undefined && authenticationToken !== null) {
				localVarHeaderParameter["authentication-token"] = String(authenticationToken);
			}

			localVarHeaderParameter["Content-Type"] = "application/json";

			setSearchParams(localVarUrlObj, localVarQueryParameter);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
			localVarRequestOptions.data = serializeDataIfNeeded(deployJobModel, localVarRequestOptions, configuration);

			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions,
			};
		},
	};
};

/**
 * ProductionAgentApi - functional programming interface
 * @export
 */
export const ProductionAgentApiFp = function (configuration?: Configuration) {
	const localVarAxiosParamCreator = ProductionAgentApiAxiosParamCreator(configuration);
	return {
		/**
		 * Deploy a project following a configuration
		 * @param {DeployJobModel} deployJobModel
		 * @param {string} [authenticationToken]
		 * @param {string} [authenticationToken2]
		 * @param {*} [options] Override http request option.
		 * @throws {RequiredError}
		 */
		async build(
			deployJobModel: DeployJobModel,
			authenticationToken?: string,
			authenticationToken2?: string,
			options?: AxiosRequestConfig
		): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<string>>> {
			const localVarAxiosArgs = await localVarAxiosParamCreator.build(deployJobModel, authenticationToken, authenticationToken2, options);
			return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
		},
	};
};

/**
 * ProductionAgentApi - factory interface
 * @export
 */
export const ProductionAgentApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
	const localVarFp = ProductionAgentApiFp(configuration);
	return {
		/**
		 * Deploy a project following a configuration
		 * @param {DeployJobModel} deployJobModel
		 * @param {string} [authenticationToken]
		 * @param {string} [authenticationToken2]
		 * @param {*} [options] Override http request option.
		 * @throws {RequiredError}
		 */
		build(deployJobModel: DeployJobModel, authenticationToken?: string, authenticationToken2?: string, options?: any): AxiosPromise<Array<string>> {
			return localVarFp.build(deployJobModel, authenticationToken, authenticationToken2, options).then((request) => request(axios, basePath));
		},
	};
};

/**
 * ProductionAgentApi - object-oriented interface
 * @export
 * @class ProductionAgentApi
 * @extends {BaseAPI}
 */
export class ProductionAgentApi extends BaseAPI {
	/**
	 * Deploy a project following a configuration
	 * @param {DeployJobModel} deployJobModel
	 * @param {string} [authenticationToken]
	 * @param {string} [authenticationToken2]
	 * @param {*} [options] Override http request option.
	 * @throws {RequiredError}
	 * @memberof ProductionAgentApi
	 */
	public build(deployJobModel: DeployJobModel, authenticationToken?: string, authenticationToken2?: string, options?: AxiosRequestConfig) {
		return ProductionAgentApiFp(this.configuration)
			.build(deployJobModel, authenticationToken, authenticationToken2, options)
			.then((request) => request(this.axios, this.basePath));
	}
}
