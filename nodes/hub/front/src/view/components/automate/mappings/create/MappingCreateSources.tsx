import React from "react";
import { Box, CircularProgress, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { ReactComponent as GithubIcon } from "../../icons/github.svg";
import { ReactComponent as GitBranchIcon } from "../../icons/git-branch.svg";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { setSelectedBranch, setSelectedRepo } from "../../../../store/module/mapping/mapping.reducer";

const camelToSnakeCase = (str: string) =>
	str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);

function MappingCreateSources() {
	const [branch, setBranch] = React.useState<string | undefined>();
	const [repository, setRepo] = React.useState<string | undefined>();
	const [branches, setBranches] = React.useState(Array<string>());

	const storeData = useAppSelector((s) => s.mapping.repositories);
	const repos = React.useMemo(() => {
		const keys = Object.keys(storeData).sort();
		const letterDones = Array<string>();
		const components = Array<{ value: string; disabled: boolean }>();

		keys.forEach((k) => {
			const firstLetter = k[0];
			if (!letterDones.includes(firstLetter)) {
				letterDones.push(firstLetter);
				components.push({ value: firstLetter, disabled: true });
			}
			components.push({ value: k, disabled: false });
		});

		return components.sort((a, b) => {
			const ka = camelToSnakeCase(a.value);
			const kb = camelToSnakeCase(b.value);
			return ka.localeCompare(kb);
		});
	}, [storeData]);

	const dispatch = useAppDispatch();

	React.useEffect(() => {
		if (repository) {
			const branches = Object.keys(storeData[repository]);
			setBranches(branches);
			setBranch(branches[0]);
			dispatch(setSelectedRepo(repository));
		}
	}, [storeData, repository, dispatch]);

	React.useEffect(() => {
		if (branch) {
			dispatch(setSelectedBranch(branch));
		}
	}, [branch, dispatch]);

	// endregion

	const size = 16;

	const onRepoChange = (e: SelectChangeEvent) => {
		setRepo(e.target.value);
	};

	const onBranchChange = (e: SelectChangeEvent) => {
		setBranch(e.target.value);
	};

	const loading = useAppSelector((s) => s.mapping.loading);

	return (
		<div className="MappingCreateSources">
			<Box className={"Container"}>
				<Typography variant={"h6"}>Github (Sources)</Typography>
				<FormControl className={"FormControl"}>
					<InputLabel id="mapping-create-repository-label">
						Repository
					</InputLabel>
					<Select
						labelId="mapping-create-repository-label"
						id="mapping-create-repository-input"
						value={repository ?? ""}
						required
						label={"Repository"}
						onChange={onRepoChange}
						renderValue={(value) => (
							<div>
								<GithubIcon width={size} height={size} />{" "}
								{value}
							</div>
						)}
					>
						{repos.map((repo) => (
							<MenuItem
								disabled={repo.disabled}
								key={repo.value}
								value={repo.value}
							>
								{repo.disabled
									? repo.value.toUpperCase()
									: repo.value}
							</MenuItem>
						))}
						{loading && (
							<MenuItem key={"loading"} disabled={true}>
								<CircularProgress size={16} />
							</MenuItem>
						)}
					</Select>
				</FormControl>

				<FormControl className={"FormControl"}>
					<InputLabel id="mapping-create-branch-label">
						Branch
					</InputLabel>
					<Select
						label={"Branch"}
						labelId="mapping-create-branch-label"
						id="mapping-create-branch-input"
						value={branch ?? ""}
						required
						onChange={onBranchChange}
						renderValue={(value) => (
							<div>
								<GitBranchIcon width={size} height={size} />{" "}
								{value}
							</div>
						)}
					>
						{branches.map((branch) => (
							<MenuItem key={branch} value={branch}>
								{branch}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>
		</div>
	);
}

export default MappingCreateSources;
