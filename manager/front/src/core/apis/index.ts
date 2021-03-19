import store from "../../view/store";
import {AuthenticationApi} from "./authentification";
import {DockerControllerApi, GithubApi} from "./back";

type _Apis = {
    core: {
        github: GithubApi,
        docker: DockerControllerApi
    },
    authentication: {
        login: AuthenticationApi,
    }
}

const getEnv = (name: string, fallback: string): string => {
    return store.getState().environments.envs[name] ?? fallback
}

export let Apis: _Apis = createApis();


export function createApis(): _Apis {

    const isDev = window.location.href.startsWith("http://localhost")
    const authentication = isDev ? "http://localhost:3001/" : "https://elyspio.fr/authentication/"
    const backend = getEnv("BACKEND_HOST", "http://localhost:4000");
    Apis = {
        core: {
            docker: new DockerControllerApi(undefined, backend),
            github: new GithubApi(undefined, backend),
        },
        authentication: {
            login: new AuthenticationApi(undefined, authentication),
        }
    }
    return Apis;
}




