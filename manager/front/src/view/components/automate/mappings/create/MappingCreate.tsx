import React from "react";
import {Typography} from "@material-ui/core";
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


		<Typography variant={"h4"} align={"center"}>Create a new mapping</Typography>

		<MappingCreateSources/>

		{display.images && <MappingCreateImages/>}

		<MappingCreateDeployment/>

	</div>
}

export default MappingCreate

