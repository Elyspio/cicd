import React from "react";
import List from "@material-ui/core/List";
import {useAppSelector} from "../../../store";
import {BuildConfig, DeployConfig, HubConfigExport, Job,} from "../../../../../../back/src/core/services/hub/types";
import {JobItem} from "./JobItem";

type Queues = HubConfigExport["queues"];
type JobsAlias = HubConfigExport["jobs"];


type WithStatus<T> = T & { status: "waiting" | "done" | "working", }
export type BuildJob = WithStatus<Job<BuildConfig>>
export type DeployJob = WithStatus<Job<DeployConfig>>

export function Jobs() {

	const {jobs, queues} = useAppSelector(state => ({
			queues: state.automation.config?.queues ?? {builds: Array<Queues["builds"][number]>(), deployments: Array<Queues["deployments"][number]>()},
			jobs: state.automation.config?.jobs ?? {builds: Array<JobsAlias["builds"][number]>(), deployments: Array<JobsAlias["deployments"][number]>()},
		})
	)

	const data = React.useMemo(() => {

		const ret = new Map<Job<any>["id"], { build?: BuildJob; deploy?: DeployJob; }>()

		jobs.builds.forEach((job: Job<BuildConfig>) => {
			if (!ret.has(job.id)) {
				ret.set(job.id, {});
			}
			ret.set(job.id, {
				...ret.get(job.id),
				build: {
					...job,
					status: job.finishedAt ? "done" : "working"
				}
			})
		})

		queues.builds.forEach((job: Job<BuildConfig>) => {
			if (!ret.has(job.id)) {
				ret.set(job.id, {});
			}
			ret.set(job.id, {
				...ret.get(job.id),
				build: {
					...job,
					status: "waiting"
				}
			})
		})

		jobs.deployments.forEach((job: Job<DeployConfig>) => {
			if (!ret.has(job.id)) {
				ret.set(job.id, {});
			}
			ret.set(job.id, {
				...ret.get(job.id),
				deploy: {
					...job,
					status: job.finishedAt ? "done" : "working"
				}
			})
		})

		queues.deployments.forEach((job: Job<DeployConfig>) => {
			if (!ret.has(job.id)) {
				ret.set(job.id, {});
			}
			ret.set(job.id, {
				...ret.get(job.id),
				deploy: {
					...job,
					status: "waiting"
				}
			})
		})

		return [...ret.entries()].sort(([id1], [id2]) => id1 < id2 ? -1 : 1);
	}, [jobs, queues])


	return <List className={"Agents"}>
		{data.map(([id, jobs]) => <JobItem
			key={id}
			data={jobs}
		/>)}
	</List>
}

export default Jobs
