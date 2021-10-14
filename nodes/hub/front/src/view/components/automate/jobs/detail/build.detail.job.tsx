import { useAppSelector } from "../../../../store";
import "./JobDetail.scss";
import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import { JobNotFound } from "./common.detail.job";

type Props = {
	id: number;
};

export function JobBuildDetail({ id }: Props) {
	const job = useAppSelector((state) => state.automation.config?.jobs.builds.find((b) => b.id === id));

	if (!job) return <JobNotFound id={id} type={"build"} />;

	return (
		<div className={"JobDetail JobBuildDetail"}>
			<Grid container justifyContent={"center"} alignItems={"center"}>
				<Grid item>
					<Typography variant={"h4"} my={2} fontWeight={"bold"}>
						Job Build Detail
					</Typography>
				</Grid>
			</Grid>

			<div className="stdout">
				<Typography variant={"overline"} fontWeight={"bold"}>
					Stdout
				</Typography>
				<Box sx={{ bgcolor: "background.default", height: "100%" }} className={"content"}>
					<pre>{job?.stdout}</pre>
				</Box>
			</div>
		</div>
	);
}
