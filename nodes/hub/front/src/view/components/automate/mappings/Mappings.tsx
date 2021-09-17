import React from "react";
import {useAppSelector} from "../../../store";
import List from "@material-ui/core/List";
import {Mapping} from "./Mapping";


export default function Mappings() {

	const storeMappings = useAppSelector(s => s.automation.config?.mappings)

	const mappings = React.useMemo(() => {
		return [...storeMappings ?? []].sort((a, b) => a.id > b.id ? -1 : 1)

	}, [storeMappings])

	return <List className={"Mappings"}>
		{mappings.map((agent, index) => <Mapping key={`M-${agent.id}`} data={agent}/>)}
	</List>
}


