import React from "react";
import List from "@material-ui/core/List";
import {connect, ConnectedProps} from "react-redux";
import {Dispatch} from "redux";
import {StoreState} from "../../../store";
import {BuildConfig, Config, DeployConfig, Job, ManagerConfigExport,} from "../../../../../../back/src/core/services/manager/types";
import {JobItem, JobItemProps} from "./JobItem";
import {push} from "connected-react-router";
import {reactRouterPath} from "../Automate";

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


export function Jobs(props: ReduxTypes) {

    const data = React.useMemo(() => {
        const ret: {
            status: JobItemProps["status"],
            type: "build" | "deployment"
            data: Job<Config>
        }[] = [];

        props.jobs.builds.forEach((job: Job<BuildConfig>) => {
            ret.push({
                data: job,
                type: "build",
                status: job.finishedAt ? "done" : "working"
            })
        })

        props.jobs.deployments.forEach((job: Job<DeployConfig>) => {
            ret.push({
                data: job,
                type: "deployment",
                status: job.finishedAt ? "done" : "working"
            })
        })

        props.queues.builds.forEach((job: Job<BuildConfig>) => {
            ret.push({
                data: job,
                type: "build",
                status: "waiting"
            })
        })

        props.queues.deployments.forEach((job: Job<DeployConfig>) => {
            ret.push({
                data: job,
                type: "deployment",
                status: "waiting"
            })
        })

        ret.sort((a, b) => a.data.id < b.data.id ? -1 : 1);


        return ret;
    }, [props.jobs, props.queues])


    return <List className={"Agents"}>
        {data.map(job => <JobItem
            key={`${job.data.id}-${job.data.startedAt?.toString()}`}
            data={job.data}
            type={job.type}
            status={job.status}
            onClick={(id) => {
                const path = job.type === "deployment" ? reactRouterPath.getDeployPath(id) : reactRouterPath.getBuildPath(id)
                props.push(path)
            }}
        />)}
    </List>
}

export default connector(Jobs)
