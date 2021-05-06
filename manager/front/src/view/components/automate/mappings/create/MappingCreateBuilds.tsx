import React from "react";
import {Box, Container, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Switch, TextField, Typography} from "@material-ui/core";
import {ReactComponent as DockerIcon} from "../../icons/docker.svg";
import {Apis} from "../../../../../core/apis";
import {deepClone} from "../../../../../core/util/data";
import {DockerConfigModelPlatformsEnum} from "../../../../../core/apis/back";
import {DockerfilesParams} from "../../../../store/module/job/types";


import {connect, ConnectedProps} from "react-redux";
import {Dispatch} from "redux";
import {StoreState} from "../../../../store";
import {automationActions} from "../../../../store/module/job/jobSplice";


const mapStateToProps = (state: StoreState) => ({
	sources: state.automation.sources
})

const mapDispatchToProps = (dispatch: Dispatch) => ({
	updateImages: (conf: StoreState["automation"]["build"]) => dispatch(automationActions.updateImages(conf))
})

const connector = connect(mapStateToProps, mapDispatchToProps);
type ReduxTypes = ConnectedProps<typeof connector>;


type Props = ReduxTypes & {};


function MappingCreateBuilds({updateImages, sources: {repository, branch, username}}: Props) {


	const [conf, setConf] = React.useState<DockerfilesParams>([])
	const [dockerfiles, setDockerfiles] = React.useState<string[]>([])
	const platforms = React.useMemo(() => [DockerConfigModelPlatformsEnum.Arm64, DockerConfigModelPlatformsEnum.Amd64], []);


	React.useEffect(() => {
		if (username && repository && branch) {
			(async () => {
				const {data: dockerfiles} = await Apis.core.github.githubGetDockerfilesForRepository(username, repository, branch)
				setConf(dockerfiles.map(x => ({platforms: platforms, dockerfile: {path: x.path, tag: "", image: "", wd: "/", use: false}})));
				setDockerfiles(dockerfiles.map(x => x.path))
			})()
		}
	}, [username, repository, branch, platforms])


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
		updateImages(configuration.filter(c => c.dockerfile.use).map(c => {
			return {
				...c,
				dockerfile: {
					...c.dockerfile,
					tag: c.dockerfile.image.slice(c.dockerfile.image.indexOf(":") + 1),
					image: c.dockerfile.image.slice(0, c.dockerfile.image.indexOf(":")),
				},
			}
		}))
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

export default connector(MappingCreateBuilds)
