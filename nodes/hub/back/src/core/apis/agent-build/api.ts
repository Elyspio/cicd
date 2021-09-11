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


import {Configuration} from './configuration';
import globalAxios, {AxiosInstance, AxiosPromise} from 'axios';
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
	toPathString
} from './common';
// @ts-ignore
import {BASE_PATH, BaseAPI, COLLECTION_FORMATS, RequestArgs, RequiredError} from './base';

/**
 *
 * @export
 * @interface BuildConfigModel
 */
export interface BuildConfigModel {
	/**
	 * Job id
	 * @type {number}
	 * @memberof BuildConfigModel
	 */
	id: number;
	/**
	 *
	 * @type {GithubDockerModel}
	 * @memberof BuildConfigModel
	 */
	config?: GithubDockerModel;
}

/**
 *
 * @export
 * @interface DockerConfigModel
 */
export interface DockerConfigModel {
	/**
	 * Dockerfiles to build
	 * @type {Array<DockerFileConfigModel>}
	 * @memberof DockerConfigModel
	 */
	dockerfiles: Array<DockerFileConfigModel>;
	/**
	 * Platforms available for the future image
	 * @type {Array<string>}
	 * @memberof DockerConfigModel
	 */
	platforms: Array<DockerConfigModelPlatformsEnum>;
	/**
	 *
	 * @type {string}
	 * @memberof DockerConfigModel
	 */
	username: string;
}

/**
 * @export
 * @enum {string}
 */
export enum DockerConfigModelPlatformsEnum {
	Arm64 = 'linux/arm64',
	Amd64 = 'linux/amd64'
}

/**
 *
 * @export
 * @interface DockerFileConfigModel
 */
export interface DockerFileConfigModel {
	/**
	 * Path to Dockerfile file
	 * @type {string}
	 * @memberof DockerFileConfigModel
	 */
	path: string;
	/**
	 * Working directory from origin
	 * @type {string}
	 * @memberof DockerFileConfigModel
	 */
	wd: string;
	/**
	 * Name for the image
	 * @type {string}
	 * @memberof DockerFileConfigModel
	 */
	image: string;
	/**
	 * Tag for the image
	 * @type {string}
	 * @memberof DockerFileConfigModel
	 */
	tag?: string;
}

/**
 *
 * @export
 * @interface GithubConfigModel
 */
export interface GithubConfigModel {
	/**
	 * Url of the repo
	 * @type {string}
	 * @memberof GithubConfigModel
	 */
	remote: string;
	/**
	 * Branch on the repo
	 * @type {string}
	 * @memberof GithubConfigModel
	 */
	branch: string;
	/**
	 * Commit Sha
	 * @type {string}
	 * @memberof GithubConfigModel
	 */
	commit?: string;
}

/**
 *
 * @export
 * @interface GithubDockerModel
 */
export interface GithubDockerModel {
	/**
	 *
	 * @type {GithubConfigModel}
	 * @memberof GithubDockerModel
	 */
	github: GithubConfigModel;
	/**
	 *
	 * @type {DockerConfigModel}
	 * @memberof GithubDockerModel
	 */
	docker: DockerConfigModel;
}

/**
 * BuildAgentApi - axios parameter creator
 * @export
 */
export const BuildAgentApiAxiosParamCreator = function (configuration?: Configuration) {
	return {
		/**
		 * Build and push a project following a configuration
		 * @param {BuildConfigModel} buildConfigModel
		 * @param {*} [options] Override http request option.
		 * @throws {RequiredError}
		 */
		buildAgentBuild: async (buildConfigModel: BuildConfigModel, options: any = {}): Promise<RequestArgs> => {
			// verify required parameter 'buildConfigModel' is not null or undefined
			assertParamExists('buildAgentBuild', 'buildConfigModel', buildConfigModel)
			const localVarPath = `/api/build-agent/build`;
			// use dummy base URL string because the URL constructor only accepts absolute URLs.
			const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
			let baseOptions;
			if (configuration) {
				baseOptions = configuration.baseOptions;
			}

			const localVarRequestOptions = {method: 'POST', ...baseOptions, ...options};
			const localVarHeaderParameter = {} as any;
			const localVarQueryParameter = {} as any;


			localVarHeaderParameter['Content-Type'] = 'application/json';

			setSearchParams(localVarUrlObj, localVarQueryParameter, options.query);
			let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
			localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};
			localVarRequestOptions.data = serializeDataIfNeeded(buildConfigModel, localVarRequestOptions, configuration)

			return {
				url: toPathString(localVarUrlObj),
				options: localVarRequestOptions,
			};
		},
	}
};

/**
 * BuildAgentApi - functional programming interface
 * @export
 */
export const BuildAgentApiFp = function (configuration?: Configuration) {
	const localVarAxiosParamCreator = BuildAgentApiAxiosParamCreator(configuration)
	return {
		/**
		 * Build and push a project following a configuration
		 * @param {BuildConfigModel} buildConfigModel
		 * @param {*} [options] Override http request option.
		 * @throws {RequiredError}
		 */
		async buildAgentBuild(buildConfigModel: BuildConfigModel, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<string>>> {
			const localVarAxiosArgs = await localVarAxiosParamCreator.buildAgentBuild(buildConfigModel, options);
			return createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration);
		},
	}
};

/**
 * BuildAgentApi - factory interface
 * @export
 */
export const BuildAgentApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
	const localVarFp = BuildAgentApiFp(configuration)
	return {
		/**
		 * Build and push a project following a configuration
		 * @param {BuildConfigModel} buildConfigModel
		 * @param {*} [options] Override http request option.
		 * @throws {RequiredError}
		 */
		buildAgentBuild(buildConfigModel: BuildConfigModel, options?: any): AxiosPromise<Array<string>> {
			return localVarFp.buildAgentBuild(buildConfigModel, options).then((request) => request(axios, basePath));
		},
	};
};

/**
 * BuildAgentApi - object-oriented interface
 * @export
 * @class BuildAgentApi
 * @extends {BaseAPI}
 */
export class BuildAgentApi extends BaseAPI {
	/**
	 * Build and push a project following a configuration
	 * @param {BuildConfigModel} buildConfigModel
	 * @param {*} [options] Override http request option.
	 * @throws {RequiredError}
	 * @memberof BuildAgentApi
	 */
	public buildAgentBuild(buildConfigModel: BuildConfigModel, options?: any) {
		return BuildAgentApiFp(this.configuration).buildAgentBuild(buildConfigModel, options).then((request) => request(this.axios, this.basePath));
	}
}


