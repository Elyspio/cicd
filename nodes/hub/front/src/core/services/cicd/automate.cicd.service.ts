import { inject, injectable } from "inversify";
import { CicdApi } from "../../apis/backend";
import { BuildDockerfileConfig, JobBuild, JobDeploy, Mapping, OperationJobsApi } from "../../apis/backend/generated";
import { ToastOn } from "../../utils/decorators";

@injectable()
export class AutomateService {
	@inject(CicdApi) private client!: CicdApi;

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
			build: { dockerfiles?: BuildDockerfileConfig; bake?: string };
		},
		deploy: { agentUri: string; dockerComposeFile: string },
	) {
		await this.client.operation.mappings.add({
			build: {
				github: {
					branch: params.github.branch,
					remote: params.github.repo,
				},
				dockerfile: params.build.dockerfiles,
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
				url: deploy.agentUri,
			},
		});
	}

	@ToastOn({
		success: (id) => `Job for mapping with id=${id} completed`,
		pending: (id) => `Starting a job for mapping with id=${id}`,
		error: (id) => `Error in job for mapping with id=${id} `,
	})
	async runMapping(id: Mapping["id"]) {
		await this.client.operation.mappings.run(id);
	}

	@ToastOn({
		success: (id) => `job with id=${id} has been deleted`,
		error: (id) => `Could not delete job with id=${id} `,
	})
	async deleteMapping(id: Mapping["id"]) {
		await this.client.operation.mappings._delete(id);
	}

	@ToastOn({
		success: (type, id) => `job with id=${id} type=${type} has been deleted`,
		error: (type, id) => `Could not delete job with id=${id} type=${type}`,
	})
	async deleteJob(id: Mapping["id"]) {
		await this.client.operation.jobs._delete(id);
	}
}

declare const v: OperationJobsApi;
export type JobType = Parameters<typeof v._delete>[0];

export type JobId = JobDeploy["id"] & JobBuild["id"];