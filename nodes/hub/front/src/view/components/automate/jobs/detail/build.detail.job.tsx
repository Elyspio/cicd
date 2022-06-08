import { useAppSelector } from "../../../../store";
import "./JobDetail.scss";
import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { JobNotFound } from "./common.detail.job";
import { AutoScroll } from "../../../utils/AutoScroll";
import { JobBuild } from "../../../../../core/apis/backend/generated";

type Props = {
	id: JobBuild["id"];
};

export function JobBuildDetail({ id }: Props) {
	const job = useAppSelector((state) => state.automation.config?.jobs.builds.find((b) => b.id === id));

	if (!job) return <JobNotFound id={id} type={"build"} />;

	return (
		<div className={"JobDetail JobBuildDetail"}>
			<Grid container justifyContent={"center"} alignItems={"center"}>
				<Grid item>
					<Typography variant={"h4"} my={2} fontWeight={"bold"}>
						Build Detail
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
					<pre>{job?.stdout}</pre>
				</AutoScroll>
			</div>
		</div>
	);
}
