import React from "react";
import { useAppSelector } from "../../../store";
import List from "@mui/material/List";
import { Mapping } from "./Mapping";
import { Divider } from "@mui/material";

export default function Mappings() {
	const storeMappings = useAppSelector((s) => s.automation.config?.mappings);

	const mappings = React.useMemo(() => {
		return [...(storeMappings ?? [])].sort((a, b) =>
			a.id > b.id ? -1 : 1,
		);
	}, [storeMappings]);

	const count = mappings.length;

	return (
		<List className={"Mappings"}>
			{[...mappings].map((map, i) => (
				<div key={`D-${map.id}`}>
					<Mapping key={`M-${map.id}`} data={map} />
					{count > 1 && i < count - 1 && (
						<Divider key={`K-${map.id}-${i}`} />
					)}
				</div>
			))}
		</List>
	);
}
