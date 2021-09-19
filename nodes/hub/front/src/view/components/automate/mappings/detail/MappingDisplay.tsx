import React, {useCallback} from "react";
import {Box, Button, Grid, Typography} from "@material-ui/core";
import "./MappingDisplay.scss";
import {MappingDisplaySource} from "./MappingDisplaySource";
import {MappingDisplayDeployment} from "./MappingDisplayDeployment";
import {MappingDisplayBuild} from "./MappingDetailBuild";
import {AutomationState} from "../../../../store/module/automation/automation";
import {useAppSelector} from "../../../../store";
import {login} from "../../../../store/module/authentication/authentication.action";
import {useDispatch} from "react-redux";


type MappingDisplayProps = {
	id: AutomationState["mappings"][number]["id"]
}


export function MappingDisplay({id}: MappingDisplayProps) {

	const {data, logged} = useAppSelector(s => ({
		data: s.automation.config?.mappings.find(mapping => mapping.id === id),
		logged: s.authentication.logged
	}));


	const dispatch = useDispatch();

	const log = useCallback(() => dispatch(login()), [dispatch])


	return <div className="MappingDisplay">

		{logged && data ? <>
			<Box className={"title"}>
				<Typography variant={"overline"} align={"center"}>Mapping <Typography color={"secondary"} component={"span"}>{data.id}</Typography></Typography>
			</Box>
			<MappingDisplaySource data={data.build.github}/>
			<MappingDisplayBuild data={data.build.docker}/>
			<MappingDisplayDeployment data={data.deploy}/>
		</> : <>
			<Grid container className={"no-logged"} justifyContent={"center"} alignItems={"center"} direction={"column"} spacing={4}>
				<Grid item>
					<Typography>You must be logged to see your mappings</Typography>
				</Grid>
				<Grid item>
					<Button size={"large"} color={"primary"} variant={"outlined"} onClick={log}>Login</Button>
				</Grid>
			</Grid>
		</>}
	</div>
}

