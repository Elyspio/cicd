import React from "react";
import {Container, FormControl, InputLabel, MenuItem, Select, Typography} from "@material-ui/core";
import {ReactComponent as GithubIcon} from "../../icons/github.svg";
import {ReactComponent as GitBranchIcon} from "../../icons/git-branch.svg";
import {useAppDispatch, useAppSelector} from "../../../../store";
import {setSelectedBranch, setSelectedRepo} from "../../../../store/module/mapping/mapping";


function MappingCreateSources() {


	const [branch, setBranch] = React.useState<string | undefined>()
	const [repository, setRepo] = React.useState<string | undefined>()
	const [branches, setBranches] = React.useState(Array<string>())


	const storeData = useAppSelector(s => s.mapping.repositories)
	const repos = Object.keys(storeData).sort();


	const dispatch  = useAppDispatch();

	// endregion

	// region fetch

	React.useEffect(() => {
		if (repository) {
			const branches = Object.keys(storeData[repository])
			setBranches(branches);
			setBranch(branches[0])
			dispatch(setSelectedRepo(repository))
		}
	}, [repository])

	React.useEffect(() => {
		if (branch) {
			dispatch(setSelectedBranch(branch))
		}
	}, [branch])

	// endregion

	const size = 16

	const onRepoChange = (e) => {
		setRepo(e.target.value as string);
	};

	const onBranchChange = (e) => {
		setBranch(e.target.value as string);
	};


	return <div className="MappingCreateSources">

		<Container className={"Container"}>
			<Typography variant={"h6"}>Github (Sources)</Typography>
			<FormControl className={"FormControl"}>
				<InputLabel id="mapping-create-repository-label">Repository</InputLabel>
				<Select
					labelId="mapping-create-repository-label"
					id="mapping-create-repository-input"
					value={repository ?? ""}
					required
					onChange={onRepoChange}
					renderValue={(value) => <div><GithubIcon width={size} height={size}/> {value}</div>}

				>
					{repos.map(repo => <MenuItem key={repo} value={repo}>{repo}</MenuItem>)}
				</Select>
			</FormControl>

			<FormControl className={"FormControl"}>
				<InputLabel id="mapping-create-branch-label">Branch</InputLabel>
				<Select
					labelId="mapping-create-branch-label"
					id="mapping-create-branch-input"
					value={branch ?? ""}
					required
					onChange={onBranchChange}
					renderValue={(value) => <div><GitBranchIcon width={size} height={size}/> {value}</div>}
				>
					{branches.map(branch => <MenuItem key={branch} value={branch}>{branch}</MenuItem>)}
				</Select>
			</FormControl>


		</Container>


	</div>
}

export default (MappingCreateSources)
