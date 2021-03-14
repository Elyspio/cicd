import React from "react";
import {Button, Chip, ListItem, ListItemAvatar, ListItemIcon, ListItemText, useTheme} from "@material-ui/core";
import {BuildConfig, Config, DeployConfig, Job} from "../../../../../../back/src/core/services/manager/types";
import {themeConnector, ThemeType} from "../agents/AgentItem";
import {ReactComponent as BuildIcon} from "../icons/buildJob.svg"
import {ReactComponent as DeployIcon} from "../icons/deploymentJob.svg"
import {ReactComponent as DockerIcon} from "../icons/docker.svg"
import {ReactComponent as GithubIcon} from "../icons/github.svg"
import {ReactComponent as GitBranchIcon} from "../icons/git-branch.svg"
import {PaletteColor} from "@material-ui/core/styles/createPalette";
import './JobItem.scss'
import {CustomChip} from "../../utils/CustomChip";

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

    return <CustomChip label={texts[status].label} color={texts[status].color}/>

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

    return <CustomChip
        label={texts[type].label}
        color={texts[type].color}
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

    if (props.type === "build") {
        const config = props.data.config as BuildConfig;
        const remote = config.github.remote.slice(config.github.remote.lastIndexOf("/") + 1, config.github.remote.lastIndexOf(".git"))
        arr.push(
            <CustomChip label={<><GithubIcon height={size} width={size}/> {remote}</>}/>,
            <CustomChip label={<><GitBranchIcon height={size} width={size}/> {config.github.branch}</>}/>
        )
    }

    if (props.type === "deployment") {
        arr.push(
            <CustomChip label={<><DockerIcon height={size} width={size}/> {(props.data.config as DeployConfig).uri}</>}/>
        )
    }

    return <Button className={"JobItem"} onClick={() => props.onClick(props.data.id)}>
        <ListItem>
            <ListItemAvatar>
                <JobAvatar type={props.type}/>
            </ListItemAvatar>
            <ListItemText
                primary={<div className={"info"}>
                    <CustomChip label={props.data.id}/>
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
