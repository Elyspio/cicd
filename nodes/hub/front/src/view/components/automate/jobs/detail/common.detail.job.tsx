import { useAppDispatch } from "../../../../store";
import "./JobDetail.scss";
import React from "react";
import { Button, Grid, Typography } from "@mui/material";
import { push } from "connected-react-router";

type Props = {
	id: number;
	type: "build" | "deploy";
};

export function JobNotFound({ id, type }: Props) {
	const dispatch = useAppDispatch();

	return (
		<Grid container justifyContent={"center"} alignItems={"center"} spacing={8} direction={"column"}>
			<Grid item>
				<Typography variant={"h4"} my={2} fontWeight={"bold"}>
					Job {type === "build" ? "Build" : "Deploy"} Detail
				</Typography>
			</Grid>

			<Grid item container alignItems={"center"}>
				<Grid item>
					<Typography mx={2}>
						Could not find a job with
						<Typography component={"span"} color={"error"} px={2}>
							id={id}
						</Typography>
					</Typography>
				</Grid>

				<Grid item>
					<Button variant={"outlined"} onClick={() => dispatch(push("/"))} size={"large"}>
						Back to dashboard
					</Button>
				</Grid>
			</Grid>
		</Grid>
	);
}
