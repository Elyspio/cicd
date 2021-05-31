import React from "react";
import List from "@material-ui/core/List";
import {connect, ConnectedProps} from "react-redux";
import {Dispatch} from "redux";
import {StoreState} from "../../../store";
import {BuildConfig, DeployConfig, Job, ManagerConfigExport,} from "../../../../../../back/src/core/services/manager/types";
import {JobItem} from "./JobItem";
import {push} from "connected-react-router";

type Queues = ManagerConfigExport["queues"];
type JobsAlias = ManagerConfigExport["jobs"];

const mapStateToProps = (state: StoreState) => ({
	queues: state.automation.config?.queues ?? {builds: Array<Queues["builds"][number]>(), deployments: Array<Queues["deployments"][number]>()},
	jobs: state.automation.config?.jobs ?? {builds: Array<JobsAlias["builds"][number]>(), deployments: Array<JobsAlias["deployments"][number]>()},
})
const mapDispatchToProps = (dispatch: Dispatch) => ({
	push: (path: string) => dispatch(push(path))
})

const connector = connect(mapStateToProps, mapDispatchToProps);
type ReduxTypes = ConnectedProps<typeof connector>;

type WithStatus<T> = T & { status: "waiting" | "done" | "working", }
export type BuildJob = WithStatus<Job<BuildConfig>>
export type DeployJob = WithStatus<Job<DeployConfig>>

export function Jobs(props: ReduxTypes) {

	const data = React.useMemo(() => {

		const ret = new Map<Job<any>["id"], { build?: BuildJob; deploy?: DeployJob; }>()

		props.jobs.builds.forEach((job: Job<BuildConfig>) => {
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

		props.queues.builds.forEach((job: Job<BuildConfig>) => {
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

		props.jobs.deployments.forEach((job: Job<DeployConfig>) => {
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

		props.queues.deployments.forEach((job: Job<DeployConfig>) => {
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
	}, [props.jobs, props.queues])


	return <List className={"Agents"}>
		{data.map(([id, jobs]) => <JobItem
			key={id}
			data={jobs}
		/>)}
	</List>
}

export default connector(Jobs)
