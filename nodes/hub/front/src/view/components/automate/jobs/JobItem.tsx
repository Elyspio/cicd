import React from "react";
import { AppBar, Box, Grid, Paper, Tab, Typography } from "@mui/material";
import "./JobItem.scss";
import { CustomChip } from "../../utils/chip/CustomChip";
import { ReactComponent as GithubIcon } from "../icons/github.svg";
import { ReactComponent as BranchIcon } from "../icons/git-branch.svg";
import { ReactComponent as DockerIcon } from "../icons/docker.svg";
import { ReactComponent as DockerComposeIcon } from "../icons/docker-compose.svg";
import Tabs from "@mui/material/Tabs";
import { TabPanel } from "../../utils/tabs/TabPanel";
import { styled } from "@mui/material/styles";
import { useAppDispatch } from "../../../store";
import { push } from "connected-react-router";
import { routes } from "../Automate";
import { JobBuild, JobDeploy } from "../../../../core/apis/backend/generated";
import { ContextMenu, ContextMenuItems } from "../../utils/ContextMenu";
import { Delete } from "@mui/icons-material";
import { deleteJob } from "../../../store/module/automation/automation.action";
import { useDispatch } from "react-redux";

const PREFIX = "JobItem";

const classes = {
	root: `${PREFIX}-root`,
};

const StyledBox = styled(Box)(({ theme }) => ({
	[`& .${classes.root}`]: {
		flexGrow: 1,
		width: "100%",
		backgroundColor: theme.palette.background.paper,
	},
}));

type LineProps<Job> = {
	data: Job;
};

const size = 12;

function BuildLine({ data }: LineProps<JobBuild>) {
	const remote = React.useMemo(() => {
		const r = data.config.github.remote;
		return r.slice("https://github.com/".length, r.length - 4);
	}, [data.config.github.remote]);

	const dockerfiles = React.useMemo(() => data.config.dockerfile?.files.map((x) => `${x.image}:${x.tag ?? "latest"}`).join(" "), [data.config.dockerfile?.files]);

	const dispatch = useAppDispatch();
	const onClick = React.useCallback(() => dispatch(push(routes.getBuildPath(data.id))), [dispatch, data.id]);

	return (
		<StyledBox className={"Line"} onClick={onClick}>
			<Grid container>
				<Grid container item xs={12} spacing={1} direction={"column"}>
					<CustomChip item icon={<GithubIcon height={size} width={size} />} title={remote} label={remote} />
					<CustomChip item icon={<BranchIcon height={size} width={size} />} title={data.config.github.branch} label={data.config.github.branch} />

					<CustomChip item icon={<DockerIcon height={size} width={size} />} title={dockerfiles} label={dockerfiles} />
				</Grid>
			</Grid>
		</StyledBox>
	);
}

function DeployLine({ data }: LineProps<JobDeploy>) {
	return (
		<Box className={"Line"}>
			<Grid container>
				<Grid container item xs={12}>
					<CustomChip item title={data.config.url} icon={<DockerIcon height={size} width={size} />} label={data.config.url} />
				</Grid>
				<Grid item container xs={12}>
					<CustomChip item title={data.config.docker?.compose?.path} icon={<DockerComposeIcon height={size} width={size} />} label={data.config.docker?.compose?.path} />
				</Grid>
			</Grid>
		</Box>
	);
}

// endregion type

export type JobItemProps = {
	data: {
		build?: JobBuild;
		deploy?: JobDeploy;
	};
};

export function JobItem(props: JobItemProps) {
	const [value, setValue] = React.useState(0);

	const handleChange = (event: React.SyntheticEvent, newValue: number) => {
		event.preventDefault();
		event.stopPropagation();
		setValue(newValue);
	};

	const dispatch = useDispatch();

	const label = React.useMemo(() => {
		if (!props.data.build) return "";
		const date = new Date(props.data.build.createdAt);
		return (
			<Grid container direction={"column"}>
				<Grid item>{date.toLocaleDateString()}</Grid>
				<Grid item>{date.toLocaleTimeString()}</Grid>
			</Grid>
		);
	}, [props.data.build]);


	const contextMenuItems: ContextMenuItems = React.useMemo(() => {
		const arr: ContextMenuItems = [];

		if (props.data.build || props.data.deploy) {
			arr.push({
				onClick: () => {
					props.data.build && dispatch(deleteJob(props.data.build.id));
					props.data.deploy && dispatch(deleteJob(props.data.deploy.id));
				},
				label: (
					<Grid container alignItems={"center"} spacing={2}>
						<Grid item>
							<Delete />
						</Grid>
						<Grid item>
							<Typography>Delete Job</Typography>
						</Grid>
					</Grid>
				),
				autoClose: true,
			});
		}

		return arr;
	}, [dispatch, props.data]);

	const tabsColor: { build?: string; deploy?: string } = React.useMemo(() => {
		let build = undefined;
		if (props.data.build?.stderr) build = "error";
		if (props.data.build && !props.data.build.stderr && props.data.build.finishedAt) build = "success";

		let deploy = undefined;
		if (props.data.deploy?.stderr) deploy = "error";
		if (props.data.deploy && !props.data.deploy.stderr && props.data.deploy.finishedAt) deploy = "success";
		return {
			build,
			deploy,
		};
	}, [props.data]);

	return (
		<Box className={"JobItem"}>
			<ContextMenu items={contextMenuItems}>
				<Paper elevation={2} className={classes.root}>
					<AppBar position={"static"} color={"default"}>
						<Tabs value={value} onChange={handleChange} variant="fullWidth" indicatorColor="secondary" textColor="inherit" aria-label="icon label tabs example">
							<Tab label={label} title={"hide"} disabled={value === 0} />
							<Tab
								className={tabsColor.build}
								// sx={{}}
								label="BUILD"
								onClick={() => props.data.build && dispatch(push(routes.getBuildPath(props.data.build.id)))}
							/>
							<Tab
								className={tabsColor.deploy}
								// sx={{ color: tabsColor.deploy + " !important" }}
								label="DEPLOY"
								onClick={() => props.data.deploy && dispatch(push(routes.getDeployPath(props.data.deploy.id)))}
							/>
						</Tabs>
					</AppBar>
					<TabPanel value={value} index={1}>
						{props.data.build ? <BuildLine data={props.data.build} /> : <Typography>No build information</Typography>}
					</TabPanel>
					<TabPanel value={value} index={2}>
						{props.data.deploy ? <DeployLine data={props.data.deploy} /> : <Typography>No deploy information</Typography>}
					</TabPanel>
				</Paper>
			</ContextMenu>
		</Box>
	);
}
