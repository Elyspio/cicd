import { inject, injectable } from "inversify";
import { DiKeysApi } from "../../di/di.keys.api";
import { CicdApi } from "../../apis/backend";
import { DockerConfigModel, MappingModel, OperationJobsApi } from "../../apis/backend/generated";
import { ToastOn } from "../../utils/decorators";

@injectable()
export class AutomateService {
	@inject(DiKeysApi.cicd) private client!: CicdApi;

	async getProductionApps() {
		return this.client.agents.getProductionApps().then((x) => x.data);
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
		deploy: { agentUri: string; dockerComposeFile: string }
	) {
		await this.client.operation.mappings.add({
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

	@ToastOn({
		success: (id) => `Job for mapping with id=${id} completed`,
		pending: (id) => `Starting a job for mapping with id=${id}`,
		error: (id) => `Error in job for mapping with id=${id} `,
	})
	async runMapping(id: MappingModel["id"]) {
		await this.client.operation.mappings.run(id);
	}

	@ToastOn({
		success: (id) => `job with id=${id} has been deleted`,
		error: (id) => `Could not delete job with id=${id} `,
	})
	async deleteMapping(id: MappingModel["id"]) {
		await this.client.operation.mappings._delete(id);
	}

	@ToastOn({
		success: (type, id) => `job with id=${id} type=${type} has been deleted`,
		error: (type, id) => `Could not delete job with id=${id} type=${type}`,
	})
	async deleteJob(type: JobType, id: MappingModel["id"]) {
		await this.client.operation.jobs._delete(type, id);
	}
}

declare const v: OperationJobsApi;
export type JobType = Parameters<typeof v._delete>[0];
