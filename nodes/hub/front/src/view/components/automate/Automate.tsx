import {Box, Grid, Paper, Typography} from "@material-ui/core";
import React from "react";
import {SimpleAccordion} from "../utils/SimpleAccordion";
import Agents from "./agents/Agents";
import {makeStyles} from "@material-ui/core/styles";
import Jobs from "./jobs/Jobs";
import {Route, Switch} from 'react-router'
import JobBuildDetail from "./jobs/detail/JobBuildDetail";
import JobDeployDetail from "./jobs/detail/JobDeployDetail";
import MappingAccordion from "./mappings/MappingAccordion";
import {MappingCreate} from "./mappings/create/MappingCreate";
import {MappingDisplay} from "./mappings/detail/MappingDisplay";


const useStyles = makeStyles(() => ({
	root: {
		height: "100%",
		width: "100%",
		display: "flex"
	},
	left: {
		maxWidth: "32rem",
		minWidth: "32rem",
		maxHeight: "100vh",
		overflow: "auto",
		margin: 20,
		overflowX: "hidden"
	},
	right: {
		width: '100%',
		margin: 20
	}
}));

export function Automate() {

	const classes = useStyles()

	return <Box bgcolor={"background.default"} className={classes.root}>

		<Paper className={classes.left}>
			<SimpleAccordion label={"Agents"}>
				<Agents/>
			</SimpleAccordion>

			<SimpleAccordion label={"Jobs"}>
				<Jobs/>
			</SimpleAccordion>

			<MappingAccordion/>

		</Paper>
		<Paper className={classes.right}>
			<Switch>
				<Route exact path="/job/build/:id" render={({match: {params: {id}}}) => id && <JobBuildDetail id={Number.parseInt(id)}/>}/>
				<Route exact path="/job/deploy/:id" render={({match: {params: {id}}}) => id && <JobDeployDetail id={Number.parseInt(id)}/>}/>
				<Route exact path={"/mapping/add"} render={() => <MappingCreate/>}/>
				<Route exact path="/mapping/:id" render={({match: {params: {id}}}) => id && <MappingDisplay id={Number.parseInt(id)}/>}/>
				<Route render={() => <Grid container justifyContent={"center"} alignItems={"center"} style={{height: "100%"}}>
					<Grid item>
						<Typography variant={"button"}>Please select one item on the left to see its details</Typography>
					</Grid>
				</Grid>}/>
			</Switch>
		</Paper>

	</Box>
}

export const routes = {
	getBuildPath: (id: number) => `/job/build/${id}`,
	getDeployPath: (id: number) => `/job/deploy/${id}`,
	getMappingPath: (id: number) => `/mapping/${id}`
}
