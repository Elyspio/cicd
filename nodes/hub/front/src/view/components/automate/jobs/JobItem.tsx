import React from "react";
import {AppBar, Box, Grid, ListItem, Paper, Tab, Typography} from "@material-ui/core";
import './JobItem.scss'
import {CustomChip} from "../../utils/chip/CustomChip";
import {ReactComponent as GithubIcon} from "../icons/github.svg";
import {ReactComponent as BranchIcon} from "../icons/git-branch.svg";
import {ReactComponent as DockerIcon} from "../icons/docker.svg";
import {ReactComponent as DockerComposeIcon} from "../icons/docker-compose.svg";
import Tabs from "@material-ui/core/Tabs";
import {TabPanel} from "../../utils/tabs/TabPanel";
import {makeStyles} from "@material-ui/core/styles";
import {useAppDispatch} from "../../../store";
import {push} from "connected-react-router";
import {routes} from "../Automate";
import {JobBuildModel, JobDeployModel} from "../../../../core/apis/backend/generated";

type LineProps<Job> = {
	data: Job
}

const size = 12;

function BuildLine({data}: LineProps<JobBuildModel>) {

	const remote = React.useMemo(() => {
		const r = data.config.github.remote;
		return r.slice("https://github.com/".length, r.length - 4)
	}, [data.config.github.remote])

	const dockerfiles = React.useMemo(() => data.config.docker.dockerfiles
		.map(x => `${x.image}:${x.tag ?? "latest"}`)
		.join(" "), [data.config.docker.dockerfiles]);

	const dispatch = useAppDispatch();
	const onClick = React.useCallback(() => dispatch(push(routes.getBuildPath(data.id))), [dispatch, data.id])

	return <Box className={"Line"} onClick={onClick}>
		<Grid container>
			<Grid container item xs={12} spacing={1} direction={"column"}>
				<CustomChip
					icon={<GithubIcon height={size} width={size}/>}
					title={remote}
					label={remote}/>
				<CustomChip
					icon={<BranchIcon height={size} width={size}/>}
					title={data.config.github.branch}
					label={data.config.github.branch}/>


				<CustomChip
					icon={<DockerIcon height={size} width={size}/>}
					title={dockerfiles}
					label={dockerfiles}/>
			</Grid>


		</Grid>
	</Box>
}

function DeployLine({data}: LineProps<JobDeployModel>) {


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
				            icon={<DockerComposeIcon height={size} width={size}/>}
				            label={data.config.docker?.compose?.path}/>
			</Grid>
		</Grid>
	</Box>

}


// endregion type


export type JobItemProps = {
	data: {
		build?: JobBuildModel,
		deploy?: JobDeployModel
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

	const dispatch = useAppDispatch();

	const label = React.useMemo(() => {
		if (!props.data.build) return "";
		const date = new Date(props.data.build.createdAt);
		return <Grid container direction={"column"}>
			<Grid item>{date.toLocaleDateString()}</Grid>
			<Grid item>{date.toLocaleTimeString()}</Grid>
		</Grid>;
	}, [props.data])

	return <Box className={"JobItem"}>
		<ListItem>
			<Paper elevation={2} className={classes.root}>
				<AppBar position={"static"} color={"default"}>
					<Tabs
						value={value}
						onChange={handleChange}
						variant="fullWidth"
						indicatorColor="primary"
						textColor="primary"
						aria-label="icon label tabs example"
					>
						<Tab label={label} title={"hide"} disabled={value === 0}/>
						<Tab label="BUILD" onClick={() => props.data.build && dispatch(push(routes.getBuildPath(props.data.build.id)))}/>
						<Tab label="DEPLOY" onClick={() => props.data.deploy && dispatch(push(routes.getDeployPath(props.data.deploy.id)))}/>
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
			</Paper>

		</ListItem>
	</Box>
}
