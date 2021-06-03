import React from "react";
import {AppBar, Box, Button, Grid, ListItem, Paper, Tab, Typography} from "@material-ui/core";
import './JobItem.scss'
import {BuildJob, DeployJob} from "./Jobs";
import {CustomChip} from "../../utils/chip/CustomChip";
import {ReactComponent as GithubIcon} from "../icons/github.svg";
import {ReactComponent as BranchIcon} from "../icons/git-branch.svg";
import {ReactComponent as DockerIcon} from "../icons/docker.svg";
import {ReactComponent as DockerComposeIcon} from "../icons/docker-compose.svg";
import {useAppSelector} from "../../../store";
import Tabs from "@material-ui/core/Tabs";
import {TabPanel} from "../../utils/tabs/TabPanel";
import {makeStyles} from "@material-ui/core/styles";

const colors: Record<BuildJob["status"], Record<"dark" | "light", string>> = {
	waiting: {
		dark: "#ffaa44",
		light: "#ff9308"
	},
	working: {
		dark: "#55f1e4",
		light: "#0773fd"
	},
	done: {
		dark: "#63ff5f",
		light: "#15cd00"
	}

}


type LineProps<Job> = {
	data: Job
}

const size = 12;

function BuildLine({data}: LineProps<BuildJob>) {

	const theme = useAppSelector(s => s.theme.current)

	let remote = data.config.github.remote;
	remote = remote.slice("https://github.com/".length, remote.length - 4)


	return <Box className={"Line"}>
		<Grid container>
			<Grid container item xs={12}>
				<Grid item xs={7}>
					<CustomChip
						icon={<GithubIcon height={size} width={size}/>}
						title={remote}
						label={remote}/>
				</Grid>
				<Grid item xs={4} style={{marginLeft: "1rem"}}>
					<CustomChip
						icon={<BranchIcon height={size} width={size}/>}
						title={data.config.github.branch}
						label={data.config.github.branch} />

				</Grid>
			</Grid>

			<Grid item>
				<CustomChip
					icon={<DockerIcon height={size} width={size}/>}
					title={data.config.docker.dockerfiles.map(x => x.image).join(" ")}
					label={data.config.docker.dockerfiles.map(x => x.image).join(" ")}/>
			</Grid>

		</Grid>
	</Box>
}


function DeployLine({data}: LineProps<DeployJob>) {


	return <Box className={"Line"}>
		<Grid container>
			<Grid container item xs={12}>
				<CustomChip
					title={data.config.uri}
					icon={<DockerIcon height={size} width={size}/>}
					label={data.config.uri}/>
			</Grid>
			<Grid item xs={12}>
				<CustomChip title={data.config.docker?.compose?.path}
				            icon={<DockerComposeIcon height={size} width={size}/> }
				            label={data.config.docker?.compose?.path}/>
			</Grid>
		</Grid>
	</Box>

}


// endregion type


export type JobItemProps = {
	data: {
		build?: BuildJob,
		deploy?: DeployJob
	}
}


const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
		width: '100%',
		backgroundColor: theme.palette.background.paper,
	},
}));

export function JobItem(props: JobItemProps) {

	const classes = useStyles();

	const [value, setValue] = React.useState(0);

	const handleChange = (event, newValue) => {
		event.preventDefault();
		event.stopPropagation();
		setValue(newValue);
	};

	return <Box className={"JobItem"} >
		<ListItem>


			<div className={classes.root}>
				<AppBar position={"static"} color={"default"}>
					<Tabs
						value={value}
						onChange={handleChange}
						variant="fullWidth"
						indicatorColor="secondary"
						textColor="secondary"
						aria-label="icon label tabs example"
					>
						<Tab label={props.data.build?.id} title={"hide"}  disabled={value === 0}/>
						<Tab label="BUILD"/>
						<Tab label="DEPLOY"/>
					</Tabs>
				</AppBar>
				<TabPanel value={value} index={1}>
					{props.data.build
						? <BuildLine data={props.data.build}/>
						: <Typography>No build information</Typography>
					}
				</TabPanel>
				<TabPanel value={value} index={2}>
					{props.data.deploy
						? <DeployLine data={props.data.deploy}/>
						: <Typography>No deploy information</Typography>
					}
				</TabPanel>
			</div>

		</ListItem>
	</Box>
}
