import { useAppSelector } from "../../../../store";
import React from "react";
import "./JobDetail.scss";
import { Box, Paper } from "@mui/material";
import { JobNotFound } from "./common.detail.job";

type Props = {
	id: number;
};

export function DeployDetailJob({ id }: Props) {
	const job = useAppSelector((state) => state.automation.config?.jobs.builds.find((b) => b.id === id));

	if (!job) return <JobNotFound id={id} type={"deploy"} />;

	return (
		<div className={"JobDetail JobBuildDetail"}>
			<header>{job.id}</header>

			<section>
				<Paper>
					<Box m={1}>
						<pre>{job?.stdout}</pre>
					</Box>
				</Paper>
			</section>
		</div>
	);
}
