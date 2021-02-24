import {Apis} from "../apis";

export class EnvironmentService {
    async getServerEnvironmentsVariables() {
        try {
            const a = await Apis.core.environments.environmentsGet()
            return a.data
        } catch (e) {
            return {"error": "Fetching is not authorized on this server."}
        }
    }
}
