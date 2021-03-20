import {AuthenticationApi} from "./authentification";
import {DockerControllerApi, GithubApi, AutomationApi} from "./back";


const isDev = window.location.href.startsWith("http://localhost")
const authentication = isDev ? "http://localhost:3001/" : "https://elyspio.fr/authentication/"
const backend = isDev ? "http://localhost:4000" : window.location.href


export const Apis = {
    core: {
        docker: new DockerControllerApi(undefined, backend),
        github: new GithubApi(undefined, backend),
        automate: new AutomationApi(undefined, backend)
    },
    authentication: {
        login: new AuthenticationApi(undefined, authentication),
    }
}
