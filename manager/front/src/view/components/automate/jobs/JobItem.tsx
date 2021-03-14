import React from "react";
import {Button, Chip, ListItem, ListItemAvatar, ListItemIcon, ListItemText, useTheme} from "@material-ui/core";
import {BuildConfig, Config, DeployConfig, Job} from "../../../../../../back/src/core/services/manager/types";
import {themeConnector, ThemeType} from "../agents/AgentItem";
import {ReactComponent as BuildIcon} from "../icon/buildJob.svg"
import {ReactComponent as DeployIcon} from "../icon/deploymentJob.svg"
import {ReactComponent as DockerIcon} from "../icon/docker.svg"
import {ReactComponent as GithubIcon} from "../icon/github.svg"
import {ReactComponent as GitBranchIcon} from "../icon/git-branch.svg"
import {PaletteColor} from "@material-ui/core/styles/createPalette";
import './JobItem.scss'

// region status

type StatusChipProps = ThemeType & {
    status: JobItemProps["status"]
}

function StatusChip({status, theme}: StatusChipProps) {

    const {palette} = useTheme();

    const texts: { [key in typeof status]: { label: string, color: string } } = {
        waiting: {label: "Waiting", color: palette.warning[theme]},
        working: {label: "Working", color: palette.info[theme]},
        done: {label: "Done", color: palette.success[theme]},
    }

    return <Chip className={"Chip"} label={texts[status].label} style={{backgroundColor: texts[status].color, fontWeight: "bold", fontSize: "90%"}}/>

}

type TypeChipProps = ThemeType & {
    type: JobItemProps["type"]
}

// endregion status

// region type

const colors: Record<TypeChipProps["type"], Pick<PaletteColor, "dark" | "light">> = {
    "build": {
        dark: "#8400ff",
        light: "#aa67f8"
    },
    "deployment": {
        dark: "#ff00c0",
        light: "#f66bd1"
    }
}

function TypeChip({type, theme}: TypeChipProps) {

    const texts: { [key in typeof type]: { label: string, color: string } } = {
        build: {label: "Build", color: colors["build"][theme]},
        deployment: {label: "Deploy", color: colors["deployment"][theme]},
    }

    return <Chip
        className={"Chip"}
        label={texts[type].label}
        style={{backgroundColor: texts[type].color, fontWeight: "bold", fontSize: "90%"}}
    />

}

const StatusChipWithStore = themeConnector(StatusChip)
const TypeChipWithStore = themeConnector(TypeChip)

// endregion type


// region avatar

const JobAvatar = ({type}: { type: JobItemProps["type"] }) => {
    const size = 48
    return <ListItemIcon className={"Avatar"}>
        {type === "deployment" && <DeployIcon height={size} width={size}/>}
        {type === "build" && <BuildIcon height={size} width={size}/>}
    </ListItemIcon>
}

// endregion avatar

export type JobItemProps = {
    data: Job<Config>
    type: "build" | "deployment"
    status: "waiting" | "working" | "done",
    onClick: (id: number) => void
}


export function JobItem(props: JobItemProps) {
    const size = 16;
    const arr: JSX.Element[] = []

    if(props.type === "build") {
        const config = props.data.config as BuildConfig;
        const remote = config.github.remote.slice(config.github.remote.lastIndexOf("/") + 1, config.github.remote.lastIndexOf(".git"))
        arr.push(
            <Chip label={<><GithubIcon  height={size} width={size} /> {remote}</>}/>,
            <Chip label={<><GitBranchIcon  height={size} width={size}/> {config.github.branch}</>}/>
        )
    }

    if(props.type === "deployment") {
        arr.push(
            <Chip label={<><DockerIcon  height={size} width={size}/> {(props.data.config as DeployConfig).uri}</>}/>
        )
    }

    return <Button className={"JobItem"} onClick={() => props.onClick(props.data.id)}>
        <ListItem>
            <ListItemAvatar>
                <JobAvatar type={props.type}/>
            </ListItemAvatar>
            <ListItemText
                primary={<div className={"info"}>
                    <Chip label={props.data.id}/>
                    <TypeChipWithStore type={props.type}/>
                    <StatusChipWithStore status={props.status}/>
                    <div className={"meta-data"}>
                        {arr}
                    </div>

                </div>}
            />
        </ListItem>
    </Button>
}
