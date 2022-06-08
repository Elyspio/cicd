import React from "react";
import { Chip, Grid, ListItem, ListItemIcon, Typography, useTheme } from "@mui/material";
import { StoreState, useAppSelector } from "../../../store";
import { ReactComponent as BuildIcon } from "../icons/buildJob.svg";
import { ReactComponent as DeployIcon } from "../icons/deploymentJob.svg";
import "./AgentItem.scss";
import { AgentBuild, AgentDeploy } from "../../../../core/apis/backend/generated";

type Props = {
	data: AgentBuild | AgentDeploy;
	type: "builder" | "production";
};

type StatusChipProps = {
	status: (AgentBuild | AgentDeploy)["availability"];
};

function StatusChip({ status }: StatusChipProps) {
	const { palette } = useTheme();
	const { theme } = useAppSelector((state: StoreState) => ({
		theme: state.theme.current,
	}));

	const texts: { [key in StatusChipProps["status"]]: { label: string; color: string } } = {
		"Down": { label: "Down", color: palette.error[theme] },
		"Free": { label: "Available", color: palette.success[theme] },
		"Running": { label: "Working", color: palette.primary[theme] },
	};

	return (
		<Chip
			label={texts[status].label}
			variant={"outlined"}
			style={{
				color: texts[status].color,
				borderColor: palette.text.disabled,
			}}
		/>
	);
}

export function AgentItem(props: Props) {
	return (
		<ListItem className={"AgentItem"}>
			<ListItemIcon className={"Avatar"}>{props.type === "production" ? <DeployIcon width={48} height={48} /> : <BuildIcon width={48} height={48} />}</ListItemIcon>
			<Grid container direction={"column"}>
				<Grid item>
					<Typography>{props.data.url}</Typography>
				</Grid>

				<Grid container alignItems={"center"} spacing={2}>
					<Grid item>Status:</Grid>
					<Grid item>
						<StatusChip status={props.data.availability} />
					</Grid>
				</Grid>
			</Grid>
		</ListItem>
	);
}
