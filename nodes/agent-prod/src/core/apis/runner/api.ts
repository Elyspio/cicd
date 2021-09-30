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
import globalAxios, { AxiosInstance, AxiosPromise } from "axios";
// Some imports not used depending on template conditions
// @ts-ignore
import {
	assertParamExists,
	createRequestFunction,
	DUMMY_BASE_URL,
	serializeDataIfNeeded,
	setApiKeyToObject,
	setBasicAuthToObject,
	setBearerAuthToObject,
	setOAuthToObject,
	setSearchParams,
	toPathString,
} from "./common";
// @ts-ignore
import { BASE_PATH, BaseAPI, COLLECTION_FORMATS, RequestArgs, RequiredError } from "./base";

/**
 *
 * @export
 * @interface ExecException
 */
export interface ExecException {
	/**
	 *
	 * @type {string}
	 * @memberof ExecException
	 */
	cmd?: string;
	/**
	 *
	 * @type {boolean}
	 * @memberof ExecException
	 */
	killed?: boolean;
	/**
	 *
	 * @type {number}
	 * @memberof ExecException
	 */
	code?: number;
	/**
	 *
	 * @type {string}
	 * @memberof ExecException
	 */
	signal?: string;
}

/**
 *
 * @export
 * @interface InlineObject
 */
export interface InlineObject {
	/**
	 *
	 * @type {string}
	 * @memberof InlineObject
	 */
	command?: string;
	/**
	 *
	 * @type {string}
	 * @memberof InlineObject
	 */
	cwd?: string;
}

/**
 *
 * @export
 * @interface RunResponse
 */
export interface RunResponse {
	/**
	 *
	 * @type {number}
	 * @memberof RunResponse
	 */
	code: number;
	/**
	 *
	 * @type {ExecException}
	 * @memberof RunResponse
	 */
	error?: ExecException;
	/**
	 *
	 * @type {string}
	 * @memberof RunResponse
	 */
	signal?: string;
	/**
	 *
	 * @type {string}
	 * @memberof RunResponse
	 */
	stderr: string;
	/**
	 *
	 * @type {string}
	 * @memberof RunResponse
	 */
	stdout: string;
}

/**
 *
 * @export
 * @interface UnauthorizedModel
 */
export interface UnauthorizedModel {
	/**
	 *
	 * @type {Array<string>}
	 * @memberof UnauthorizedModel
	 */
	errors?: Array<string>;
	/**
	 *
	 * @type {string}
	 * @memberof UnauthorizedModel
	 */
	message?: string;
	/**
	 *
	 * @type {string}
	 * @memberof UnauthorizedModel
	 */
	name?: string;
	/**
	 *
	 * @type {number}
	 * @memberof UnauthorizedModel
	 */
	status?: number;
}

/**
 * RunnerApi - axios parameter creator
 * @export
 */
export const RunnerApiAxiosParamCreator = function (configuration?: Configuration) {
	return {
		/**
		 *
		 * @param {InlineObject} [inlineObject]
		 * @param {*} [options] Override http request option.
		 * @throws {RequiredError}
		 */
		runnerRun: async (inlineObject?: InlineObject, options: any = {}): Promise<RequestArgs> => {
			const localVarPath = `/core/run`;
			// use dummy base URL string because the URL constructor only accepts absolute URLs.
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) {
				baseOptions = configuration.baseOptions;
			}

			const localVarRequestOptions = {
				method: "POST",
				...baseOptions,
				...options,
			};
			const localVarHeaderParameter = {} as any;
			const localVarQueryParameter = {} as any;

			localVarHeaderParameter["Content-Type"] = "application/json";

			setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {
				...localVarHeaderParameter,
				...headersFromBaseOptions,
				...options.headers,
			};
			localVarRequestOptions.data = serializeDataIfNeeded(inlineObject, localVarRequestOptions, configuration);

			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions,
			};
		},
	};
};

/**
 * RunnerApi - functional programming interface
 * @export
 */
export const RunnerApiFp = function (configuration?: Configuration) {
	const localVarAxiosParamCreator = RunnerApiAxiosParamCreator(configuration);
	return {
		/**
		 *
		 * @param {InlineObject} [inlineObject]
		 * @param {*} [options] Override http request option.
		 * @throws {RequiredError}
		 */
		async runnerRun(inlineObject?: InlineObject, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<RunResponse>> {
			const localVarAxiosArgs = await localVarAxiosParamCreator.runnerRun(inlineObject, options);
			return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
		},
	};
};

/**
 * RunnerApi - factory interface
 * @export
 */
export const RunnerApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
	const localVarFp = RunnerApiFp(configuration);
	return {
		/**
		 *
		 * @param {InlineObject} [inlineObject]
		 * @param {*} [options] Override http request option.
		 * @throws {RequiredError}
		 */
		runnerRun(inlineObject?: InlineObject, options?: any): AxiosPromise<RunResponse> {
			return localVarFp.runnerRun(inlineObject, options).then((request) => request(axios, basePath));
		},
	};
};

/**
 * RunnerApi - object-oriented interface
 * @export
 * @class RunnerApi
 * @extends {BaseAPI}
 */
export class RunnerApi extends BaseAPI {
	/**
	 *
	 * @param {InlineObject} [inlineObject]
	 * @param {*} [options] Override http request option.
	 * @throws {RequiredError}
	 * @memberof RunnerApi
	 */
	public runnerRun(inlineObject?: InlineObject, options?: any) {
		return RunnerApiFp(this.configuration)
			.runnerRun(inlineObject, options)
			.then((request) => request(this.axios, this.basePath));
	}
}
