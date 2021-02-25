import store from "../../view/store";

type Apis = {
    core: {

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

        }
    }
    return Apis;
}




