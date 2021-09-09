import {Box, Paper, Typography} from "@material-ui/core";
import React from "react";
import {SimpleAccordion} from "../utils/SimpleAccordion";
import Agents from "./agents/Agents";
import {makeStyles} from "@material-ui/core/styles";
import Jobs from "./jobs/Jobs";
import {Route, Switch} from 'react-router'
import JobBuildDetail from "./jobs/detail/JobBuildDetail";
import JobDeployDetail from "./jobs/detail/JobDeployDetail";
import MappingAccordion from "./mappings/MappingAccordion";
import MappingCreate from "./mappings/create/MappingCreate";


const useStyles = makeStyles((theme) => ({
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
				<Route exact path={"/mapping/add"} component={MappingCreate}/>
				<Route render={() => <Typography>Please select one item on the left to see its details</Typography>}/>
			</Switch>
		</Paper>

	</Box>
}

export const reactRouterPath = {
	getBuildPath(id: number) {
		return `/job/build/${id}`
	},
	getDeployPath(id: number) {
		return `/job/deploy/${id}`
	}
}
