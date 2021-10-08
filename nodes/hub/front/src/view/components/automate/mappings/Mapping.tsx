import React from "react";
import { Box, Grid, ListItem, ListItemText } from "@mui/material";
import "./Mapping.scss";
import { ReactComponent as GithubIcon } from "../icons/github.svg";
import { ReactComponent as GitBranchIcon } from "../icons/git-branch.svg";
import { ReactComponent as DockerIcon } from "../icons/docker.svg";
import { CustomChip } from "../../utils/chip/CustomChip";
import { push } from "connected-react-router";
import { routes } from "../Automate";
import { useAppDispatch } from "../../../store";
import { HubConfig } from "../../../../core/apis/backend/generated";

type Props = {
	data: HubConfig["mappings"][number];
};

const size = 20;

export function Mapping({ data: { build, deploy, id } }: Props) {
	const remote = build.github.remote.slice(build.github.remote.lastIndexOf("/") + 1, build.github.remote.lastIndexOf(".git"));

	const dispatch = useAppDispatch();
	const changeUri = React.useCallback(() => dispatch(push(routes.getMappingPath(id))), [dispatch, id]);

	return (
		<Box onClick={changeUri} className={"Mapping full-w MuiAppBar-colorDefault"}>
			<ListItem>
				<ListItemText
					primary={
						<div className={"info"}>
							<CustomChip icon={<GithubIcon height={size} width={size} />} label={remote} title={remote} />
							<CustomChip icon={<GitBranchIcon height={size} width={size} />} label={build.github.branch} title={build.github.branch} />
							<CustomChip icon={<DockerIcon height={size} width={size} />} title={deploy.uri} label={deploy.uri} />
						</div>
					}
				/>
			</ListItem>
			<Grid className="actions" container>
				<Grid item></Grid>
			</Grid>
		</Box>
	);
}
