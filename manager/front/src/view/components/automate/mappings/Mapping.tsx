import React from "react";
import {Button, ListItem, ListItemIcon, ListItemText} from "@material-ui/core";
import {ManagerConfigExport} from "../../../../../../back/src/core/services/manager/types";
import {ReactComponent as LinkIcon} from "../icons/link.svg"
import "./Mapping.scss"
import {ReactComponent as GithubIcon} from "../icons/github.svg";
import {ReactComponent as GitBranchIcon} from "../icons/git-branch.svg";
import {ReactComponent as DockerIcon} from "../icons/docker.svg";
import {CustomChip} from "../../utils/CustomChip";

type Props = {
    data: ManagerConfigExport["mappings"][number]
}


export function Mapping({data: {build, deploy}}: Props) {

    const size = 16;
    const remote = build.github.remote.slice(build.github.remote.lastIndexOf("/") + 1, build.github.remote.lastIndexOf(".git"))

    return <Button className={"Mapping"}>
        <ListItem>
            <ListItemIcon className={"Avatar"}>
                <LinkIcon width={size * 3} height={size * 3}/>
            </ListItemIcon>
            <ListItemText
                primary={<div className={"info"}>
                    <CustomChip label={<><GithubIcon height={size} width={size}/> {remote}</>}/>
                    <CustomChip label={<><GitBranchIcon height={size} width={size}/> {build.github.branch}</>}/>
                    <CustomChip label={<><DockerIcon height={size} width={size}/> {deploy.uri}</>}/>
                </div>}
            />
        </ListItem>
    </Button>

}
