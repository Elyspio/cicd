import React from "react";
import {Paper} from "@material-ui/core";
import {ProductionAgent as IProductionAgent} from "../../../../../../back/src/core/services/hub/types";


type Props = {
	data: IProductionAgent
}


export function ProductionAgent(props: Props) {
	return <Paper className={"ProductionAgent"}>

	</Paper>
}
