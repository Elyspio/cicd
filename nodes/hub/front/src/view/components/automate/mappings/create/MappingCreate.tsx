import React from "react";
import {Box, Button, Typography} from "@material-ui/core";
import MappingCreateSources from "./MappingCreateSources";
import "./MappingCreate.scss";
import MappingCreateImages from "./MappingCreateBuilds";
import MappingCreateDeployment from "./MappingCreateDeployment";
import {useAppSelector} from "../../../../store";

function MappingCreate() {


	const display = useAppSelector(s => ({
		images: s.mapping.selected.repo && s.mapping.selected.branch
	}))

	return <div className="MappingCreate">


		<Box className={"title"}>
			<Typography variant={"overline"} align={"center"}>Create a new mapping</Typography>
		</Box>

		<MappingCreateSources/>

		{display.images && <MappingCreateImages/>}

		<MappingCreateDeployment/>

		<Box className={"Container button-validate-container"}>
			<Button size={"large"} variant={"outlined"} color={"primary"}>Validate</Button>
		</Box>


	</div>
}

export default MappingCreate

