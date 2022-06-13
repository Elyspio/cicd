import { useAppSelector } from "../../../../store";
import React from "react";
import "./JobDetail.scss";
import { Stack, Typography } from "@mui/material";
import { JobNotFound, JobStd, parseStd } from "./common.detail.job";
import { JobDeploy } from "../../../../../core/apis/backend/generated";

type Props = {
	id: JobDeploy["id"];
};

export function DeployDetailJob({ id }: Props) {
	const job = useAppSelector((state) => state.automation.config?.jobs.deploys.find((b) => b.id === id));


	const stdout = React.useMemo(() => parseStd(job?.stdout), [job]);
	const stderr = React.useMemo(() => parseStd(job?.stderr), [job]);


	if (!job) return <JobNotFound id={id} type={"deploy"} />;


	return (
		<Stack
			className={"JobDetail"}
			id={"job-detail-deploy"}
			height={"100%"}
			direction={"column"}
			spacing={2}
			justifyContent={"center"}
			alignItems={"center"}
		>
			<Typography variant={"h4"} my={2} fontWeight={"bold"}>
				Deployment Detail
			</Typography>

			{job.stderr && <JobStd title={"Error"} content={stderr} />}
			<JobStd title={"Output"} content={stdout} />
		</Stack>
	);
}
