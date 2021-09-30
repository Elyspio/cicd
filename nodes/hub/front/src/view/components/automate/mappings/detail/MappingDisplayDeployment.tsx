import React from "react";
import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { ReactComponent as DockerIcon } from "../../icons/docker.svg";
import { MappingModel } from "../../../../../core/apis/backend/generated";

const size = 16;

type MappingDisplayDeploymentProps = {
	data: MappingModel["deploy"];
};

export function MappingDisplayDeployment({
	                                         data: { uri, docker },
                                         }: MappingDisplayDeploymentProps) {
	return (
		<div className="MappingCreateDeployment">
			<Box className={"Container"}>
				<Typography variant={"h6"}>Deployments</Typography>
				<FormControl className={"FormControl"}>
					<InputLabel
						id={`mapping-create-image-platform-label-${uri}-${docker.compose?.path}`}
					>
						Agent
					</InputLabel>
					<Select
						labelId={`mapping-create-deployment-agent-label-${uri}-${docker.compose?.path}`}
						id={`mapping-create-deployment-agent-input-${uri}-${docker.compose?.path}`}
						value={uri}
						renderValue={(value) => (
							<div>
								<DockerIcon width={size} height={size} />{" "}
								{value}
							</div>
						)}
						label={"Agent"}
						inputProps={{ readOnly: true }}
					>
						<MenuItem value={uri} key={uri}>
							{uri}
						</MenuItem>
					</Select>
				</FormControl>

				{docker.compose && (
					<FormControl className={"FormControl"}>
						<InputLabel
							id={`mapping-create-image-platform-label-${uri}-${docker.compose?.path}`}
						>
							docker-compose.yml path
						</InputLabel>
						<Select
							labelId={`mapping-create-deployment-app-label-${uri}-${docker.compose?.path}`}
							id={`mapping-create-deployment-app-input-${uri}-${docker.compose?.path}`}
							value={docker.compose.path}
							label={"docker-compose.yml path"}
							inputProps={{ readOnly: true }}
						>
							<MenuItem
								value={docker.compose.path}
								key={docker.compose.path}
							>
								{docker.compose.path}
							</MenuItem>
							)
						</Select>
					</FormControl>
				)}
			</Box>
		</div>
	);
}
