import React from "react";
import {Box, Container, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField, Typography} from "@material-ui/core";
import {ReactComponent as DockerIcon} from "../../icons/docker.svg";
import {deepClone} from "../../../../../core/util/data";
import {DockerConfigModelPlatformsEnum} from "../../../../../core/apis/back";
import {DockerfilesParams} from "../../../../store/module/automation/types";
import {useAppSelector} from "../../../../store";


function MappingCreateBuilds() {


	const [conf, setConf] = React.useState<DockerfilesParams>([])


	const dockerfiles: string[] = useAppSelector(s => {
		const repo = s.mapping.repositories[s.mapping.selected.repo ?? ""];
		if (repo && s.mapping.selected.branch) {
			return repo[s.mapping.selected.branch]
		}
		return [];
	})

	const platforms = React.useMemo(() => [DockerConfigModelPlatformsEnum.Arm64, DockerConfigModelPlatformsEnum.Amd64], []);


	React.useEffect(() => {
		setConf(dockerfiles.map(x => ({platforms: platforms, dockerfile: {path: x, tag: "", image: "", wd: "/", use: false}})));
	}, [dockerfiles])


	function update(event: React.ChangeEvent<{ value: any }>, key: keyof DockerfilesParams[number]["dockerfile"], index: number) {
		const clone = deepClone(conf);
		const dockerfileConf = clone[index].dockerfile;
		if (key === "use")
			dockerfileConf[key] = !dockerfileConf[key]
		else
			dockerfileConf[key] = event.target.value
		syncChanges(clone)
	}

	function updatePlatform(event: React.ChangeEvent<{ value: any }>, index: number) {
		const clone = deepClone(conf);
		clone[index].platforms = event.target.value
		syncChanges(clone)
	}


	function syncChanges(configuration: typeof conf) {
		setConf(configuration)
		// updateImages(configuration.filter(c => c.dockerfile.use).map(c => {
		// 	return {
		// 		...c,
		// 		dockerfile: {
		// 			...c.dockerfile,
		// 			tag: c.dockerfile.image.slice(c.dockerfile.image.indexOf(":") + 1),
		// 			image: c.dockerfile.image.slice(0, c.dockerfile.image.indexOf(":")),
		// 		},
		// 	}
		// }))
	}

	const size = 16

	return <div className="MappingCreateImages">

		<Container className={"Container"}>
			<Typography variant={"h6"}>Docker (Images)</Typography>
			{conf.map((conf, index) => <>
				<Box className={"image-container"} key={index}>
					<FormControl className={"FormControl"}>
						<InputLabel id={`mapping-create-image-dockerfile-label-${index}`}>Dockerfile</InputLabel>
						<Select
							labelId={`mapping-create-image-dockerfile-label-${index}`}
							id={`mapping-create-image-dockerfile-input-${index}`}
							value={conf.dockerfile.path}
							onChange={e => update(e, "path", index)}
							renderValue={(value) => <div><DockerIcon width={size} height={size}/> {value}</div>}
							required
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
						value={conf.dockerfile.image}
						error={conf.dockerfile.use && conf.dockerfile.image.length === 0}
						required
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


			</>)}


		</Container>


	</div>
}

export default (MappingCreateBuilds)
