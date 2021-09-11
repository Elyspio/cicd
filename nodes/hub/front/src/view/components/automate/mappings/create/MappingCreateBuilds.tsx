import React from "react";
import {Box, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField, Typography} from "@material-ui/core";
import {ReactComponent as DockerIcon} from "../../icons/docker.svg";
import {deepClone} from "../../../../../core/utils/data";
import {DockerfilesParams} from "../../../../store/module/automation/types";
import {useAppSelector} from "../../../../store";
import {setDockerfiles} from "../../../../store/module/mapping/mapping";
import {useDispatch} from "react-redux";
import {DockerConfigModelPlatformsEnum} from "../../../../../core/apis/backend/generated"


function MappingCreateBuilds() {


	const [conf, setConf] = React.useState<DockerfilesParams>([])


	const repo = useAppSelector(s => s.mapping.selected.repo);

	const dockerfiles: string[] = useAppSelector(s => {
		const repo = s.mapping.repositories[s.mapping.selected.repo ?? ""];
		if (repo && s.mapping.selected.branch) {
			return repo[s.mapping.selected.branch] ?? []
		}
		return [];
	})

	const platforms = React.useMemo(() => [
		DockerConfigModelPlatformsEnum.Arm64,
		DockerConfigModelPlatformsEnum.Amd64
	], []);


	React.useEffect(() => {
		console.log(dockerfiles, repo)
		setConf(dockerfiles.map(x => {
			let tag = "latest";

			if (dockerfiles.length > 1) {
				tag = x.substring(0, x.toLowerCase().indexOf("dockerfile"))
					.replaceAll("/", "-")
					.replaceAll("\\", "-")

				if (tag[tag.length - 1] === "-") tag = tag.substr(0, tag.length - 1);
			}

			console.log("tag", tag);
			return ({
				platforms,
				dockerfile: {
					path: x,
					tag: tag ?? "",
					image: repo ?? "",
					wd: "/",
					use: false
				}
			});
		}));
	}, [dockerfiles, repo, platforms])


	function update(event: React.ChangeEvent<{ value: any }>, key: keyof DockerfilesParams[number]["dockerfile"], index: number) {
		const clone = deepClone(conf);
		const dockerfileConf = clone[index].dockerfile;

		switch (key) {
			case "image":
				const [image, tag] = event.target.value.split(":");
				dockerfileConf.image = image ?? "";
				dockerfileConf.tag = tag ?? "";

				break;

			case "use":
				dockerfileConf[key] = !dockerfileConf[key]
				break;

			default:
				dockerfileConf[key] = event.target.value
		}

		syncChanges(clone)
	}

	function updatePlatform(event: React.ChangeEvent<{ value: any }>, index: number) {
		const clone = deepClone(conf);
		clone[index].platforms = event.target.value
		syncChanges(clone)
	}

	const dispatch = useDispatch();

	function syncChanges(configuration: typeof conf) {
		setConf(configuration)
		const dockerfiles = configuration.filter(conf => conf.dockerfile.use && conf.dockerfile.wd.length > 0);
		console.log("sync", dockerfiles);
		dispatch(setDockerfiles(dockerfiles))
	}

	const size = 16

	return <div className="MappingCreateImages">

		<Box className={"Container"}>
			<Typography variant={"h6"}>Docker (Images)</Typography>
			{conf.map((conf, index) => <Box className={"image-container"} key={conf.dockerfile.path}>
					<FormControl className={"FormControl"}>
						<InputLabel id={`mapping-create-image-dockerfile-label-${index}`}>Dockerfile</InputLabel>
						<Select
							labelId={`mapping-create-image-dockerfile-label-${index}`}
							id={`mapping-create-image-dockerfile-input-${index}`}
							value={conf.dockerfile.path}
							onChange={e => update(e, "path", index)}
							renderValue={(value) => <div><DockerIcon width={size} height={size}/> {value}</div>}
							required
							disabled
						>
							{dockerfiles.map(repo => <MenuItem key={repo} value={repo}>{repo}</MenuItem>)}
						</Select>
					</FormControl>

					<TextField
						className={"FormControl"}
						id={`mapping-create-image-dockerfile-input-${index}`}
						label="Working directory"
						value={conf.dockerfile.wd}
						required
						error={conf.dockerfile.use && conf.dockerfile.wd.length === 0}
						onChange={e => update(e, "wd", index)}
					/>


					<TextField
						className={"FormControl"}
						id={`mapping-create-image-input-${index}`}
						label="Image name"
						value={`${conf.dockerfile.image}:${conf.dockerfile.tag}`}
						error={conf.dockerfile.use && conf.dockerfile.image.length === 0}
						required
						autoComplete="off"
						data-lpignore="true"
						data-form-type="text"
						onChange={e => update(e, "image", index)}
					/>


					<FormControl className={"FormControl"}>
						<InputLabel id={`mapping-create-image-platform-label-${index}`}>Platforms</InputLabel>
						<Select
							labelId={`mapping-create-image-platform-label-${index}`}
							id={`mapping-create-image-platform-input-${index}`}
							value={conf.platforms}
							multiple
							required
							onChange={e => updatePlatform(e, index)}
						>
							{platforms.map(repo => <MenuItem key={repo} value={repo}>{repo}</MenuItem>)}
						</Select>
					</FormControl>

					<FormControlLabel
						control={<Switch
							color="primary"
							size="small"
							checked={conf.dockerfile.use}
							onChange={e => update(e, "use", index)}
						/>}
						labelPlacement="top"
						label="Use"
					/>
				</Box>
			)}
		</Box>


	</div>
}

export default (MappingCreateBuilds)