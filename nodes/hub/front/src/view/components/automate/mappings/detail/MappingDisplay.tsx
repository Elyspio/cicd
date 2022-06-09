import React, { useCallback } from "react";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import "./MappingDisplay.scss";
import { MappingDisplaySource } from "./MappingDisplaySource";
import { MappingDisplayDeployment } from "./MappingDisplayDeployment";
import { MappingDisplayBuild } from "./MappingDetailBuild";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { login } from "../../../../store/module/authentication/authentication.action";
import { Clear, PlayArrow } from "@mui/icons-material";
import { Mapping } from "../../../../../core/apis/backend/generated";
import { deleteMapping, runMapping } from "../../../../store/module/mapping/mapping.action";

type MappingDisplayProps = {
	id: Mapping["id"];
};

export function MappingDisplay({ id }: MappingDisplayProps) {
	const { data, logged } = useAppSelector((s) => ({
		data: s.automation.config?.mappings.find((mapping) => mapping.id === id),
		logged: s.authentication.logged,
	}));


	const dispatch = useAppDispatch() as any;

	const log = useCallback(() => dispatch(login() as any), [dispatch]);

	const run = useCallback(() => {
		dispatch(runMapping(id));
	}, [dispatch, id]);

	const del = React.useCallback(() => dispatch(deleteMapping(id)), [dispatch, id]);

	return (
		<div className="MappingDisplay">
			{logged && data ? (
				<>
					<Box className={"title"}>
						<Typography variant={"overline"} align={"center"}>
							Mapping{" "}
							<Typography color={"secondary"} component={"span"}>
								{data.id}
							</Typography>
						</Typography>
					</Box>

					<Grid className="actions" container justifyItems={"center"} alignItems={"center"} spacing={2}>
						<Grid item>
							<IconButton onClick={run}>
								<PlayArrow />
							</IconButton>
						</Grid>
						<Grid item>
							<IconButton onClick={del}>
								<Clear />
							</IconButton>
						</Grid>
					</Grid>

					<MappingDisplaySource data={data.build.github} />
					<MappingDisplayBuild data={data.build.dockerfile} />
					<MappingDisplayDeployment data={data.deploy} />
				</>
			) : (
				<>
					<Grid container className={"no-logged"} justifyContent={"center"} alignItems={"center"} direction={"column"} spacing={4}>
						<Grid item>
							<Typography>You must be logged to manage mappings</Typography>
						</Grid>
						<Grid item>
							<Button size={"large"} color={"primary"} variant={"outlined"} onClick={log}>
								Login
							</Button>
						</Grid>
					</Grid>
				</>
			)}
		</div>
	);
}
