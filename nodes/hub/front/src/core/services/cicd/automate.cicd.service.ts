import { inject, injectable } from "inversify";
import { DiKeysApi } from "../../di/di.keys.api";
import { CicdApi } from "../../apis/backend";
import { DockerConfigModel } from "../../apis/backend/generated";
import { ToastOn } from "../../utils/decorators";

@injectable()
export class AutomateService {
	@inject(DiKeysApi.cicd) private client!: CicdApi;

	async getProductionApps() {
		return this.client.automation.getProductionApps().then((x) => x.data);
	}

	@ToastOn({
		success: "Mapping created",
		pending: "Creating mapping",
		error: "Could not create mapping",
	})
	async createMapping(
		params: {
			github: { repo: string; branch: string };
			build: { dockerfiles?: DockerConfigModel; bake?: string };
		},
		deploy: { agentUri: string; dockerComposeFile: string },
	) {
		await this.client.operation.register({
			build: {
				github: {
					branch: params.github.branch,
					remote: params.github.repo,
				},
				dockerfiles: params.build.dockerfiles,
				bake: params.build.bake
					? {
						bakeFilePath: params.build.bake,
					}
					: undefined,
			},
			deploy: {
				docker: {
					compose: { path: deploy.dockerComposeFile },
				},
				uri: deploy.agentUri,
			},
		});
	}
}
