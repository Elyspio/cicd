import React from "react";
import List from "@mui/material/List";
import {useAppSelector} from "../../../store";
import {JobItem} from "./JobItem";
import {HubConfig, JobBuildModel, JobDeployModel} from "../../../../core/apis/backend/generated";

type Queues = HubConfig["queues"];
type JobsAlias = HubConfig["jobs"];

type WithStatus<T> = T & { status: "waiting" | "done" | "working", }

export function Jobs() {

	const {jobs, queues} = useAppSelector(state => ({
			queues: state.automation.config?.queues ?? {builds: Array<Queues["builds"][number]>(), deployments: Array<Queues["deployments"][number]>()},
			jobs: state.automation.config?.jobs ?? {builds: Array<JobsAlias["builds"][number]>(), deployments: Array<JobsAlias["deployments"][number]>()},
		})
	)

	const data = React.useMemo(() => {

		const ret = new Map<JobsAlias["builds"][number]["id"], { build?: WithStatus<JobBuildModel>; deploy?: WithStatus<JobDeployModel>; }>()

		jobs.builds.forEach((job) => {
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

		queues.builds.forEach((job) => {
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

		jobs.deployments.forEach((job) => {
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

		queues.deployments.forEach((job) => {
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
