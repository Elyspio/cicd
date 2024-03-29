import { Box, Grid, Paper, Typography } from "@mui/material";
import React from "react";
import { SimpleAccordion } from "../utils/SimpleAccordion";
import Agents from "./agents/Agents";
import { styled } from "@mui/material/styles";
import Jobs from "./jobs/Jobs";
import { Route, Switch } from "react-router";
import { JobBuildDetail } from "./jobs/detail/build.detail.job";
import { DeployDetailJob } from "./jobs/detail/deploy.detail.job";
import MappingAccordion from "./mappings/MappingAccordion";
import { MappingCreate } from "./mappings/create/MappingCreate";
import { MappingDisplay } from "./mappings/detail/MappingDisplay";

const PREFIX = "Automate";

const classes = {
	root: `${PREFIX}-root`,
	left: `${PREFIX}-left`,
	right: `${PREFIX}-right`,
};

const StyledBox = styled(Box)(() => ({
	[`&.${classes.root}`]: {
		height: "100%",
		width: "100%",
		display: "flex",
	},

	[`& .${classes.left}`]: {
		maxWidth: "32rem",
		minWidth: "32rem",
		maxHeight: "100vh",
		overflow: "auto",
		margin: 20,
		overflowX: "hidden",
	},

	[`& .${classes.right}`]: {
		margin: 20,
		width: "100%",
	},
}));

export function Automate() {
	return (
		<StyledBox bgcolor={"background.default"} className={classes.root}>
			<Paper className={classes.left}>
				<Box my={1}>
					<SimpleAccordion label={"Agents"}>
						<Agents />
					</SimpleAccordion>
				</Box>

				<Box my={1}>
					<SimpleAccordion label={"Jobs"}>
						<Jobs />
					</SimpleAccordion>
				</Box>

				<Box my={1}>
					<MappingAccordion />
				</Box>
			</Paper>
			<Paper className={classes.right}>
				<Switch>
					<Route
						exact
						path="/job/build/:id"
						render={({
							         match: {
								         params: { id },
							         },
						         }) => id && <JobBuildDetail id={id} />}
					/>
					<Route
						exact
						path="/job/deploy/:id"
						render={({
							         match: {
								         params: { id },
							         },
						         }) => id && <DeployDetailJob id={id} />}
					/>
					<Route exact path={"/mapping/add"} render={() => <MappingCreate />} />
					<Route
						exact
						path="/mapping/:id"
						render={({
							         match: {
								         params: { id },
							         },
						         }) => id && <MappingDisplay id={id} />}
					/>
					<Route
						render={() => (
							<Grid container justifyContent={"center"} alignItems={"center"} style={{ height: "100%" }}>
								<Grid item>
									<Typography variant={"button"}>Please select one item on the left to see its details</Typography>
								</Grid>
							</Grid>
						)}
					/>
				</Switch>
			</Paper>
		</StyledBox>
	);
}

export const routes = {
	getBuildPath: (id: string) => `/job/build/${id}`,
	getDeployPath: (id: string) => `/job/deploy/${id}`,
	getMappingPath: (id: string) => `/mapping/${id}`,
};
