import React from "react";
import {Box, Button, ListItem, ListItemAvatar, ListItemText, Typography} from "@material-ui/core";
import {themeConnector, ThemeType} from "../agents/AgentItem";
import './JobItem.scss'
import {BuildJob, DeployJob} from "./Jobs";
import {CustomChip} from "../../utils/CustomChip";
import {ReactComponent as GithubIcon} from "../icons/github.svg";
import {ReactComponent as BranchIcon} from "../icons/git-branch.svg";
import {ReactComponent as DockerIcon} from "../icons/docker.svg";
import {ReactComponent as DockerComposeIcon} from "../icons/docker-compose.svg";
import {useAppSelector} from "../../../store";
import TextOverflow from "../../utils/textOverflow/TextOverflow";

// region status

// type StatusChipProps = ThemeType & {
//     status: JobItemProps["status"]
// }
//
// function StatusChip({status, theme}: StatusChipProps) {
//
//     const {palette} = useTheme();
//
//     const texts: { [key in typeof status]: { label: string, color: string } } = {
//         waiting: {label: "Waiting", color: palette.warning[theme]},
//         working: {label: "Working", color: palette.info[theme]},
//         done: {label: "Done", color: palette.success[theme]},
//     }
//
//     return <CustomChip label={texts[status].label} color={texts[status].color}/>
//
// }

type TypeChipProps = ThemeType & {
	label: string,
	value: string
	status: BuildJob["status"]
}

// endregion status

// region type

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

function TextTheme({theme, value, label, status}: TypeChipProps) {

	return <Typography
		className={"TextTheme"}
		variant={"subtitle2"}
	>
		<span className="label">{label}</span>
		<Typography variant={"subtitle1"}>{value}</Typography>
	</Typography>

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
		<Box className="header">
			<CustomChip color={colors[data.status][theme]} label={"Build"}/>
		</Box>
		<Box className={"chips"}>
			<CustomChip label={<><GithubIcon height={size} width={size}/> {remote}</>}/>
			<CustomChip label={<><BranchIcon height={size} width={size}/> {data.config.github.branch}</>}/>
			<CustomChip label={<><DockerIcon height={size} width={size}/> {data.config.docker.dockerfiles.map(x => x.image).join(" ")}</>}/>
		</Box>
	</Box>
}


function DeployLine({data}: LineProps<DeployJob>) {

	const theme = useAppSelector(s => s.theme.current)


	return <Box className={"Line"}>
		<Box className="header">
			<CustomChip color={colors[data.status][theme]} label={"Deploy"}/>
		</Box>
		<Box className={"chips"}>
			<CustomChip label={<><DockerIcon height={size} width={size}/> <TextOverflow text={data.config.uri}/></>}/>
			{data.config.docker?.compose && <CustomChip label={<><DockerComposeIcon height={size * 1.5} width={size * 1.5}/> <TextOverflow text={data.config.docker?.compose?.path}/></>}/>}

		</Box>
	</Box>
}


// const StatusChipWithStore = themeConnector(StatusChip)
const TextThemeWithStore = themeConnector(TextTheme)

// endregion type


// region avatar

// const JobAvatar = ({type}: { type: JobItemProps["type"] }) => {
//     const size = 48
//     return <ListItemIcon className={"Avatar"}>
//         {type === "deployment" && <DeployIcon height={size} width={size}/>}
//         {type === "build" && <BuildIcon height={size} width={size}/>}
//     </ListItemIcon>
// }

// endregion avatar

export type JobItemProps = {
	data: { build?: BuildJob, deploy?: DeployJob }
}


export function JobItem(props: JobItemProps) {
	const size = 16;
	const arr: JSX.Element[] = []

	// if (props.type === "build") {
	//     const config = props.data.config as BuildConfig;
	//     const remote = config.github.remote.slice(config.github.remote.lastIndexOf("/") + 1, config.github.remote.lastIndexOf(".git"))
	//     arr.push(
	//         <CustomChip key={1} label={<><GithubIcon height={size} width={size}/> {remote}</>}/>,
	//         <CustomChip key={2} label={<><GitBranchIcon height={size} width={size}/> {config.github.branch}</>}/>
	//     )
	// }
	//
	// if (props.type === "deployment") {
	//     arr.push(
	//         <CustomChip key={3} label={<><DockerIcon height={size} width={size}/> {(props.data.config as DeployConfig).uri}</>}/>
	//     )
	// }

	return <Button className={"JobItem"}>
		<ListItem>
			<ListItemAvatar>
				<ListItemText>{props.data.deploy?.id || props.data.build?.id}</ListItemText>
			</ListItemAvatar>
			<ListItemText
				primary={<div className={"info"}>
					{props.data.build && <BuildLine
                        data={props.data.build}
                    />}
					{props.data.deploy && <DeployLine data={props.data.deploy}/>}
				</div>}
			/>
		</ListItem>
	</Button>
}
