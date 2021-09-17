import React, {useCallback} from "react";
import {Box, Button, Grid, Typography} from "@material-ui/core";
import MappingCreateSources from "./MappingCreateSources";
import "./MappingCreate.scss";
import MappingCreateImages from "./MappingCreateBuilds";
import MappingCreateDeployment from "./MappingCreateDeployment";
import {useAppSelector} from "../../../../store";
import {login} from "../../../../store/module/authentication/authentication.action";
import {useDispatch} from "react-redux";

function MappingCreate() {

	const {logged, images} = useAppSelector(s => ({
		images: s.mapping.selected.repo && s.mapping.selected.branch,
		logged: s.authentication.logged
	}))

	const dispatch = useDispatch()


	const log = useCallback(() => dispatch(login()), [dispatch])

	return <div className="MappingCreate">

		<Box className={"title"}>
			<Typography variant={"overline"} align={"center"}>Create a new mapping</Typography>
		</Box>


		{logged ? <>
			<MappingCreateSources/>
			{images && <MappingCreateImages/>}
			<MappingCreateDeployment/>
			<Box className={"Container button-validate-container"}>
				<Button size={"large"} variant={"outlined"} color={"primary"}>Validate</Button>
			</Box>
		</> : <>
			<Grid container className={"no-logged"} justifyContent={"center"} alignItems={"center"} direction={"column"} spacing={4}>
				<Grid item>
					<Typography>You must be logged to create a mapping</Typography>
				</Grid>
				<Grid item>
					<Button size={"large"} color={"primary"} variant={"outlined"} onClick={log}>Login</Button>
				</Grid>
			</Grid>
		</>
		}
	</div>
}

export default MappingCreate

