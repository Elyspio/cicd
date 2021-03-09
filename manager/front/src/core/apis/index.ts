import {EnvironmentsApi, ExampleApi} from "./back"
import store from "../../view/store";

type Apis = {
    core: {
        example: ExampleApi,
        environments: EnvironmentsApi
    }
}

const getEnv = (name: string, fallback: string): string => {
    return store.getState().environments.envs[name] ?? fallback
}

export var Apis: Apis = createApis();

export function createApis(): Apis {

    const backend = getEnv("BACKEND_HOST", "http://localhost:4000");
    Apis = {
        core: {
            example: new ExampleApi({basePath: backend}),
            environments: new EnvironmentsApi({basePath: backend})
        }
    }
    return Apis;
}




