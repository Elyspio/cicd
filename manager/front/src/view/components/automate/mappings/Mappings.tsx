import React from "react";
import {useAppDispatch, useAppSelector} from "../../../store";
import List from "@material-ui/core/List";
import {Mapping} from "./Mapping";
import {initMappingData} from "../../../store/module/mapping/mapping";
import {useDispatch} from "react-redux";


export default function Mappings() {


	const dispatch = useDispatch()

	React.useEffect(() => {
		dispatch(initMappingData())
	}, [])


	const storeMappings = useAppSelector(s => s.automation.config?.mappings)

	const mappings = React.useMemo(() => {
		return [...storeMappings ?? []].sort((a, b) => a.id > b.id ? -1 : 1)

	}, [storeMappings])

	return <List className={"Mappings"}>
		{mappings.map((agent, index) => <Mapping key={`M-${agent.id}`} data={agent}/>)}
	</List>
}


