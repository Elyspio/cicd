import React, { BaseSyntheticEvent, useState } from "react";
import { Box, FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";
import { deepClone } from "../../../../../core/utils/data";
import { DockerfilesParams } from "../../../../store/module/automation/types";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { useDispatch } from "react-redux";
import { DockerBakeModel, DockerConfigModelPlatformsEnum } from "../../../../../core/apis/backend/generated";
import { setBake, setDockerfiles, setSelectedType } from "../../../../store/module/mapping/mapping.reducer";
import { ReactComponent as DockerIcon } from "../../icons/docker.svg";
import { iconSize } from "../../../../../config/icons";
import * as path from "path";

function MappingCreateBuilds() {
	const type = useAppSelector((s) => s.mapping.selected.build.type);

	const [value, setValue] = useState(type);

	const dispatch = useAppDispatch();

	const set = React.useCallback(
		(event: SelectChangeEvent) => {
			const val = event.target.value as typeof type;
			setValue(val);
			dispatch(setSelectedType(val));
		},
		[dispatch]
	);

	return (
		<Box className={"MappingCreateBuilds Container"}>
			<Typography variant={"h6"}>Docker (Images)</Typography>

			<FormControl className={"FormControl"} color={"primary"}>
				<InputLabel id={`mapping-create-image-type-label`} color={"primary"}>
					Type
				</InputLabel>
				<Select
					color={"primary"}
					labelId={`mapping-create-image-type-label`}
					id={`mapping-create-image-type-input`}
					value={value}
					label={"Type"}
					onChange={set}
					required
				>
					<MenuItem key={"DockerFiles"} value={"dockerfiles"}>
						DockerFiles
					</MenuItem>
					<MenuItem key={"Bake"} value={"bake"}>
						Bake
					</MenuItem>
				</Select>
			</FormControl>

			<Box my={4}>
				{value === "dockerfiles" && <MappingCreateBuildDockerfiles />}
				{value === "bake" && <MappingCreateBuildBake />}
			</Box>
		</Box>
	);
}

function MappingCreateBuildBake() {
	const bake = useAppSelector((s) => {
		if (s.mapping.selected.source.repo && s.mapping.selected.source.branch) {
			const repo = s.mapping.repositories[s.mapping.selected.source.repo];
			return repo[s.mapping.selected.source.branch]?.bake;
		}
	});
	const dispatch = useAppDispatch();

	const setConfig = React.useCallback(
		(data: typeof conf) => {
			dispatch(setBake(data));
			setConf(data);
		},
		[dispatch]
	);

	const [conf, setConf] = React.useState<DockerBakeModel>({
		bakeFilePath: bake ?? "/",
	});
	React.useEffect(() => {
		bake && setConfig({ bakeFilePath: bake });
	}, [bake, setConfig]);

	return (
		<Box className="MappingCreateBuildBake">
			<FormControl className={"FormControl"} fullWidth>
				<InputLabel id={`mapping-create-image-bake-label`}>Bake file path</InputLabel>
				<Select
					labelId={`mapping-create-image-bake-label`}
					id={`mapping-create-image-bake-input`}
					value={conf.bakeFilePath}
					title={conf.bakeFilePath}
					onChange={(e) => setConfig({ bakeFilePath: e.target.value })}
					label={"Bake file path"}
					required
				>
					<MenuItem value={conf.bakeFilePath}>{conf.bakeFilePath}</MenuItem>
				</Select>
			</FormControl>
		</Box>
	);
}

function MappingCreateBuildDockerfiles() {
	const [conf, setConf] = React.useState<DockerfilesParams>([]);

	const repo = useAppSelector((s) => s.mapping.selected.source.repo);

	const dockerfiles: string[] = useAppSelector((s) => {
		if (repo && s.mapping.selected.source.branch) {
			return s.mapping.repositories[repo][s.mapping.selected.source.branch].dockerfiles;
		}
		return [];
	});

	const platforms = React.useMemo(() => [DockerConfigModelPlatformsEnum.Arm64, DockerConfigModelPlatformsEnum.Amd64], []);

	React.useEffect(() => {
		setConf(
			dockerfiles.map((x) => {
				let tag = "latest";

				if (dockerfiles.length > 1) {
					tag = x.substring(0, x.toLowerCase().indexOf("dockerfile")).replaceAll("/", "-").replaceAll("\\", "-");

					if (tag[tag.length - 1] === "-") tag = tag.substr(0, tag.length - 1);
				}

				console.log("tag", tag);
				return {
					platforms,
					dockerfile: {
						path: x,
						tag: tag ?? "",
						image: repo ?? "",
						wd: path.join("/", path.dirname(x)),
						use: false,
					},
				};
			})
		);
	}, [dockerfiles, repo, platforms]);

	function update(event: BaseSyntheticEvent, key: keyof DockerfilesParams[number]["dockerfile"], index: number) {
		event.preventDefault();
		event.stopPropagation();
		const clone = deepClone(conf);
		const dockerfileConf = clone[index].dockerfile;

		switch (key) {
			case "image":
				const [image, tag] = event.target.value.split(":");
				dockerfileConf.image = image ?? "";
				dockerfileConf.tag = tag ?? "";

				break;

			case "use":
				dockerfileConf[key] = !dockerfileConf[key];
				break;

			default:
				dockerfileConf[key] = event.target.value;
		}

		syncChanges(clone);
	}

	function updatePlatform(event: SelectChangeEvent<DockerConfigModelPlatformsEnum[]>, index: number) {
		const clone = deepClone(conf);
		clone[index].platforms = event.target.value as DockerConfigModelPlatformsEnum[];
		syncChanges(clone);
	}

	const dispatch = useDispatch();

	function syncChanges(configuration: typeof conf) {
		setConf(configuration);
		const dockerfiles = configuration.filter((conf) => conf.dockerfile.use && conf.dockerfile.wd.length > 0);
		console.log("sync", dockerfiles);
		dispatch(setDockerfiles(dockerfiles));
	}

	return (
		<Box>
			{conf.map((conf, index) => (
				<Paper
					variant={"outlined"}
					className={`image-container ${conf.dockerfile.use ? "selected" : ""}`}
					key={conf.dockerfile.path}
					onClick={(e) => e.target === e.currentTarget && update(e, "use", index)}
				>
					<Box className="image-container tuple">
						<FormControl className={"FormControl"}>
							<InputLabel id={`mapping-create-image-dockerfile-label-${index}`}>Dockerfile</InputLabel>
							<Select
								labelId={`mapping-create-image-dockerfile-label-${index}`}
								id={`mapping-create-image-dockerfile-input-${index}`}
								label={"Dockerfile"}
								value={conf.dockerfile.path}
								title={conf.dockerfile.path}
								onChange={(e) => update(e as any, "path", index)}
								renderValue={(value) => (
									<div>
										<DockerIcon width={iconSize} height={iconSize} /> {value}
									</div>
								)}
								required
								disabled
							>
								{dockerfiles.map((repo) => (
									<MenuItem key={repo} value={repo}>
										{repo}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<TextField
							className={"FormControl"}
							id={`mapping-create-image-dockerfile-input-${index}`}
							label="Working directory"
							value={conf.dockerfile.wd}
							title={conf.dockerfile.wd}
							disabled={!conf.dockerfile.use}
							required
							error={conf.dockerfile.use && conf.dockerfile.wd.length === 0}
							onChange={(e) => update(e, "wd", index)}
						/>
					</Box>
					<Box className="image-container triple">
						<TextField
							className={"FormControl"}
							id={`mapping-create-image-input-${index}`}
							label="Image name"
							value={`${conf.dockerfile.image}:${conf.dockerfile.tag}`}
							title={`${conf.dockerfile.image}:${conf.dockerfile.tag}`}
							error={conf.dockerfile.use && conf.dockerfile.image.length === 0}
							required
							disabled={!conf.dockerfile.use}
							autoComplete="off"
							data-lpignore="true"
							data-form-type="text"
							onChange={(e) => update(e, "image", index)}
						/>

						<FormControl className={"FormControl"}>
							<InputLabel id={`mapping-create-image-platform-label-${index}`}>Platforms</InputLabel>
							<Select
								labelId={`mapping-create-image-platform-label-${index}`}
								id={`mapping-create-image-platform-input-${index}`}
								value={conf.platforms}
								title={conf.platforms.join(" ")}
								multiple
								label={"Platforms"}
								disabled={!conf.dockerfile.use}
								required
								onChange={(e) => updatePlatform(e, index)}
							>
								{platforms.map((repo) => (
									<MenuItem key={repo} value={repo}>
										{repo}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>
				</Paper>
			))}
		</Box>
	);
}

export default MappingCreateBuilds;
