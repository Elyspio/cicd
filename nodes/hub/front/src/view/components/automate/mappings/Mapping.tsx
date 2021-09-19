import React from "react";
import {Button, ListItem, ListItemIcon, ListItemText, Paper} from "@material-ui/core";
import {ReactComponent as LinkIcon} from "../icons/link.svg"
import "./Mapping.scss"
import {ReactComponent as GithubIcon} from "../icons/github.svg";
import {ReactComponent as GitBranchIcon} from "../icons/git-branch.svg";
import {ReactComponent as DockerIcon} from "../icons/docker.svg";
import {CustomChip} from "../../utils/chip/CustomChip";
import {push} from "connected-react-router";
import {routes} from "../Automate";
import {useAppDispatch} from "../../../store";
import {HubConfig} from "../../../../core/apis/backend/generated";

type Props = {
	data: HubConfig["mappings"][number]
}

const size = 16;

export function Mapping({data: {build, deploy, id}}: Props) {

	const remote = build.github.remote.slice(build.github.remote.lastIndexOf("/") + 1, build.github.remote.lastIndexOf(".git"))

	const dispatch = useAppDispatch();

	const changeUri = React.useCallback(() => dispatch(push(routes.getMappingPath(id))), [dispatch, id])

	return <Button className={"Mapping"} onClick={changeUri} variant={"text"}>
		<Paper elevation={2} className={"full-w MuiAppBar-colorDefault"}>
			<ListItem>
				<ListItemIcon className={"Avatar"}>
					<LinkIcon width={size * 3} height={size * 3}/>
				</ListItemIcon>
				<ListItemText
					primary={<div className={"info"}>
						<CustomChip
							icon={<GithubIcon height={size} width={size}/>}
							label={remote}
						/>
						<CustomChip
							icon={<GitBranchIcon height={size} width={size}/>}
							label={build.github.branch}
						/>
						<CustomChip
							icon={<DockerIcon height={size} width={size}/>}
							label={deploy.uri}
						/>
					</div>}
				/>
			</ListItem>
		</Paper>

	</Button>

}
