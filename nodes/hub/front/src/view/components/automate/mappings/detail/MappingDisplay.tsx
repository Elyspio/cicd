import React, { useCallback } from "react";
import { Box, Button, Grid, IconButton, Typography } from "@mui/material";
import "./MappingDisplay.scss";
import { MappingDisplaySource } from "./MappingDisplaySource";
import { MappingDisplayDeployment } from "./MappingDisplayDeployment";
import { MappingDisplayBuild } from "./MappingDetailBuild";
import { useAppSelector } from "../../../../store";
import { login } from "../../../../store/module/authentication/authentication.action";
import { useDispatch } from "react-redux";
import { Clear, PlayArrow } from "@mui/icons-material";
import { useInjection } from "inversify-react";
import { AutomateService } from "../../../../../core/services/cicd/automate.cicd.service";
import { DiKeysService } from "../../../../../core/di/di.keys.service";
import { Mapping } from "../../../../../core/apis/backend/generated";

type MappingDisplayProps = {
	id: Mapping["id"];
};

export function MappingDisplay({ id }: MappingDisplayProps) {
	const { data, logged } = useAppSelector((s) => ({
		data: s.automation.config?.mappings.find((mapping) => mapping.id === id),
		logged: s.authentication.logged,
	}));

	const services = {
		automate: useInjection<AutomateService>(DiKeysService.core.automate),
	};

	const dispatch = useDispatch();

	const log = useCallback(() => dispatch(login()), [dispatch]);

	const run = useCallback(() => {
		return services.automate.runMapping(id);
	}, [services.automate, id]);

	const deleteMapping = React.useCallback(() => services.automate.deleteMapping(id), [id, services.automate]);

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
							<IconButton onClick={deleteMapping}>
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
