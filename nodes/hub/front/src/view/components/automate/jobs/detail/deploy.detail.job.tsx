import { useAppSelector } from "../../../../store";
import React from "react";
import "./JobDetail.scss";
import { Box, Grid, Typography } from "@mui/material";
import { JobNotFound } from "./common.detail.job";
import { AutoScroll } from "../../../utils/AutoScroll";
import { JobDeploy } from "../../../../../core/apis/backend/generated";

type Props = {
	id: JobDeploy["id"];
};

export function DeployDetailJob({ id }: Props) {
	const job = useAppSelector((state) => state.automation.config?.jobs.deploys.find((b) => b.id === id));

	if (!job) return <JobNotFound id={id} type={"deploy"} />;

	return (
		<div className={"JobDetail JobBuildDetail"}>
			<Grid container justifyContent={"center"} alignItems={"center"}>
				<Grid item>
					<Typography variant={"h4"} my={2} fontWeight={"bold"}>
						Deployment Detail
					</Typography>
				</Grid>
			</Grid>

			{job.stderr && (
				<Grid item className="error" my={2}>
					<Typography variant={"overline"} fontWeight={"bold"}>
						Error
					</Typography>

					<Box sx={{ bgcolor: "background.default", height: "100%", color: "error.main" }} className={"content"}>
						<pre>{job.stderr}</pre>
					</Box>
				</Grid>
			)}

			<div className="stdout">
				<Typography variant={"overline"} fontWeight={"bold"}>
					Stdout
				</Typography>
				<AutoScroll sx={{ bgcolor: "background.default", height: "100%" }} className={"content"} length={job?.stdout?.length ?? 0} to={"bottom"}>
					<pre>{job.stdout}</pre>
				</AutoScroll>
			</div>
		</div>
	);
}
