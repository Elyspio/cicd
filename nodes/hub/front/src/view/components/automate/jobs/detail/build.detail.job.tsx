import { useAppSelector } from "../../../../store";
import "./JobDetail.scss";
import React from "react";
import { Stack, Typography } from "@mui/material";
import { JobNotFound, JobStd, parseStd } from "./common.detail.job";
import { JobBuild } from "../../../../../core/apis/backend/generated";

type Props = {
	id: JobBuild["id"];
};


export function JobBuildDetail({ id }: Props) {
	const job = useAppSelector((state) => state.automation.config?.jobs.builds.find((b) => b.id === id));

	const stdout = React.useMemo(() => parseStd(job?.stdout), [job]);
	const stderr = React.useMemo(() => parseStd(job?.stderr), [job]);

	if (!job) return <JobNotFound id={id} type={"build"} />;

	return (
		<Stack
			className={"JobDetail"}
			id={"job-detail-build"}
			height={"100%"}
			direction={"column"}
			spacing={2}
			justifyContent={"center"}
			alignItems={"center"}
		>
			<Typography variant={"h4"} my={2} fontWeight={"bold"}>
				Build Detail
			</Typography>

			{job.stderr && <JobStd title={"Error"} content={stderr} />}
			<JobStd title={"Output"} content={stdout} />
		</Stack>

	);
}
