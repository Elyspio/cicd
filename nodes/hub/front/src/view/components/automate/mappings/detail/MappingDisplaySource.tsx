import React from "react";
import {Box, FormControl, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import {ReactComponent as GithubIcon} from "../../icons/github.svg";
import {ReactComponent as GitBranchIcon} from "../../icons/git-branch.svg";
import {MappingModel} from "../../../../../core/apis/backend/generated";


type MappingDisplaySourceProps = {
	data: MappingModel["build"]["github"]
}

const size = 16

export function MappingDisplaySource({data: {branch, remote}}: MappingDisplaySourceProps) {

	const repo = remote.slice(remote.lastIndexOf("/") + 1, remote.indexOf(".git"));


	return <div className="MappingCreateSources">

		<Box className={"Container"}>
			<Typography variant={"h6"}>Github (Sources)</Typography>
			<FormControl className={"FormControl"}>
				<InputLabel id="mapping-create-repository-label">Repository</InputLabel>
				<Select
					labelId="mapping-create-repository-label"
					id="mapping-create-repository-input"
					value={repo}
					renderValue={(value) => <div><GithubIcon width={size} height={size}/> {value}</div>}
					inputProps={{readOnly: true}}
					label={"Repository"}
				>
					{<MenuItem key={repo} value={repo}>{repo}</MenuItem>}
				</Select>
			</FormControl>

			<FormControl className={"FormControl"}>
				<InputLabel id="mapping-create-branch-label">Branch</InputLabel>
				<Select
					labelId="mapping-create-branch-label"
					id="mapping-create-branch-input"
					value={branch}
					renderValue={(value) => <div><GitBranchIcon width={size} height={size}/> {value}</div>}
					inputProps={{readOnly: true}}
					label={"Branch"}
				>
					<MenuItem key={branch} value={branch}>{branch}</MenuItem>
				</Select>
			</FormControl>
		</Box>
	</div>
}

