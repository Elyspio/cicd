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
     *
     * @type {GithubConfigModel}
     * @memberof BuildConfigModel
     */
    github: GithubConfigModel;
    /**
     *
     * @type {DockerConfigModel}
     * @memberof BuildConfigModel
     */
    docker: DockerConfigModel;
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
 * BuildAgentApi - axios parameter creator
 * @export
 */
export const BuildAgentApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         *
         * @param {BuildConfigModel} buildConfigModel
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        buildAgentGetBuilderAgent: async (buildConfigModel: BuildConfigModel, options: any = {}): Promise<RequestArgs> => {
            // verify required parameter 'buildConfigModel' is not null or undefined
            assertParamExists('buildAgentGetBuilderAgent', 'buildConfigModel', buildConfigModel)
            const localVarPath = `/core/build-agent/build`;
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
         *
         * @param {BuildConfigModel} buildConfigModel
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async buildAgentGetBuilderAgent(buildConfigModel: BuildConfigModel, options?: any): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<void>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.buildAgentGetBuilderAgent(buildConfigModel, options);
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
         *
         * @param {BuildConfigModel} buildConfigModel
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        buildAgentGetBuilderAgent(buildConfigModel: BuildConfigModel, options?: any): AxiosPromise<void> {
            return localVarFp.buildAgentGetBuilderAgent(buildConfigModel, options).then((request) => request(axios, basePath));
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
     *
     * @param {BuildConfigModel} buildConfigModel
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof BuildAgentApi
     */
    public buildAgentGetBuilderAgent(buildConfigModel: BuildConfigModel, options?: any) {
        return BuildAgentApiFp(this.configuration).buildAgentGetBuilderAgent(buildConfigModel, options).then((request) => request(this.axios, this.basePath));
    }
}


