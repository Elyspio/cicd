import React from "react";
import List from "@mui/material/List";
import { useAppSelector } from "../../../store";
import { JobItem } from "./JobItem";
import { HubConfig, JobBuild, JobDeploy } from "../../../../core/apis/backend/generated";

type JobsAlias = HubConfig["jobs"];

type WithStatus<T> = T & { status: "waiting" | "done" | "working" };

export function Jobs() {
	const { jobs, queues } = useAppSelector((state) => ({
		queues: state.automation.config.queues,
		jobs: state.automation.config.jobs,
	}));

	const data = React.useMemo(() => {
		const ret = new Map<JobsAlias["builds"][number]["id"],
			{
				build?: WithStatus<JobBuild>;
				deploy?: WithStatus<JobDeploy>;
			}>();

		jobs.builds.forEach((job) => {
			if (!ret.has(job.id)) {
				ret.set(job.id, {});
			}
			ret.set(job.id, {
				...ret.get(job.id),
				build: {
					...job,
					status: job.finishedAt ? "done" : "working",
				},
			});
		});

		queues.builds.forEach((job) => {
			if (!ret.has(job.id)) {
				ret.set(job.id, {});
			}
			ret.set(job.id, {
				...ret.get(job.id),
				build: {
					...job,
					status: "waiting",
				},
			});
		});

		jobs.deploys.forEach((job) => {
			if (!ret.has(job.id)) {
				ret.set(job.id, {});
			}
			ret.set(job.id, {
				...ret.get(job.id),
				deploy: {
					...job,
					status: job.finishedAt ? "done" : "working",
				},
			});
		});

		queues.deploys.forEach((job) => {
			if (!ret.has(job.id)) {
				ret.set(job.id, {});
			}
			ret.set(job.id, {
				...ret.get(job.id),
				deploy: {
					...job,
					status: "waiting",
				},
			});
		});

		return [...ret.entries()].sort(([id1], [id2]) => (id1 < id2 ? -1 : 1));
	}, [jobs, queues]);

	return (
		<List className={"Agents"}>
			{data.map(([id, jobs]) => (
				<JobItem key={id} data={jobs} />
			))}
		</List>
	);
}

export default Jobs;
