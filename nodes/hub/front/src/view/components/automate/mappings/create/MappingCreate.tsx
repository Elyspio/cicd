import React, { useCallback } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import "./MappingCreate.scss";
import MappingCreateSources from "./MappingCreateSources";
import MappingCreateImages from "./MappingCreateBuilds";
import MappingCreateDeployment from "./MappingCreateDeployment";
import { useAppSelector } from "../../../../store";
import { login } from "../../../../store/module/authentication/authentication.action";
import { useDispatch } from "react-redux";
import { createMapping } from "../../../../store/module/mapping/mapping.action";

export function MappingCreate() {
	const { logged, images, valid } = useAppSelector((s) => ({
		images: s.mapping.selected.source.repo && s.mapping.selected.source.branch,
		logged: s.authentication.logged,
		valid: Boolean(
			s.mapping.selected.deploy?.dockerfilePath &&
			s.mapping.selected.deploy?.url &&
			(s.mapping.selected.build?.dockerfiles || s.mapping.selected.build?.bake) &&
			s.mapping.selected.source?.repo &&
			s.mapping.selected.source?.branch,
		),
	}));

	const dispatch = useDispatch();

	const log = useCallback(() => dispatch(login()), [dispatch]);

	const register = useCallback(() => dispatch(createMapping()), [dispatch]);

	return (
		<div className="MappingCreate">
			<Box className={"title"}>
				<Typography variant={"overline"} align={"center"}>
					Create a new mapping
				</Typography>
			</Box>

			{logged ? (
				<>
					<MappingCreateSources />
					{images && <MappingCreateImages />}
					<MappingCreateDeployment />
					<Box className={"Container button-validate-container"}>
						<Button disabled={!valid} onClick={register} size={"large"} variant={"outlined"} color={"primary"}>
							Create
						</Button>
					</Box>
				</>
			) : (
				<>
					<Grid container className={"no-logged"} justifyContent={"center"} alignItems={"center"} direction={"column"} spacing={4}>
						<Grid item>
							<Typography>You must be logged to create a mapping</Typography>
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
