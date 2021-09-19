import React from "react";
import {Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography} from "@material-ui/core";
import {ReactComponent as DockerIcon} from "../../icons/docker.svg";
import {MappingModel} from "../../../../../core/apis/backend/generated";


type MappingDisplaySourceProps = {
	data: MappingModel["build"]["docker"]
}

const size = 16


export function MappingDisplayBuild({data: {dockerfiles, platforms}}: MappingDisplaySourceProps) {

	return <div className="MappingCreateImages">

		<Box className={"Container"}>
			<Typography variant={"h6"}>Docker (Images)</Typography>
			{dockerfiles.map((dockerfile, index) => <Box className={"image-container"} key={dockerfile.path}>
					<FormControl className={"FormControl"}>
						<InputLabel id={`mapping-create-image-dockerfile-label-${index}`}>Dockerfile</InputLabel>
						<Select
							labelId={`mapping-create-image-dockerfile-label-${index}`}
							id={`mapping-create-image-dockerfile-input-${index}`}
							value={dockerfile.path}
							renderValue={(value) => <div><DockerIcon width={size} height={size}/> {value}</div>}
							disabled
						>
							<MenuItem key={dockerfile.path} value={dockerfile.path}>{dockerfile.path}</MenuItem>
						</Select>
					</FormControl>

					<TextField
						className={"FormControl"}
						id={`mapping-create-image-dockerfile-input-${index}`}
						label="Working directory"
						value={dockerfile.wd}
						disabled
					/>


					<TextField
						className={"FormControl"}
						id={`mapping-create-image-input-${index}`}
						label="Image name"
						value={`${dockerfile.image}:${dockerfile.tag}`}
						disabled
					/>

					<FormControl className={"FormControl"}>
						<InputLabel id={`mapping-create-image-platform-label-${index}`}>Platforms</InputLabel>
						<Select
							labelId={`mapping-create-image-platform-label-${index}`}
							id={`mapping-create-image-platform-input-${index}`}
							value={platforms}
							multiple
							disabled
						>
							{platforms.map(repo => <MenuItem key={repo} value={repo}>{repo}</MenuItem>)}
						</Select>
					</FormControl>
				</Box>
			)}
		</Box>


	</div>
}

