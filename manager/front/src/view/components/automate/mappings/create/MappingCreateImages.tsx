import React from "react";
import {Box, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography} from "@material-ui/core";
import {ReactComponent as DockerIcon} from "../../icons/docker.svg";
import {Apis} from "../../../../../core/apis";
import {BuildConfig} from "../../../../../../../back/src/core/services/manager/types";
import {deepClone} from "../../../../../core/util/data";
import {DockerConfigModelPlatformsEnum} from "../../../../../core/apis/back";

export type DockerfilesParams = {
    dockerfile: BuildConfig["docker"]["dockerfiles"][number],
    platforms: BuildConfig["docker"]["platforms"],
}[];
type Props = {
    onChanges: {
        dockerfiles: (config: DockerfilesParams) => void,
    },
    sources: {
        username: string,
        repository: string,
        branch: string
    }
};

export function MappingCreateImages({onChanges, sources: {repository, branch, username}}: Props) {


    const [conf, setConf] = React.useState<DockerfilesParams>([])
    const [dockerfiles, setDockerfiles] = React.useState<string[]>([])
    const platforms = React.useMemo(() => [DockerConfigModelPlatformsEnum.Arm64, DockerConfigModelPlatformsEnum.Amd64], []);


    React.useEffect(() => {
        if (username && repository && branch) {
            (async () => {
                const {data: dockerfiles} = await Apis.core.github.githubGetDockerfilesForRepository(username, repository, branch)
                setConf(dockerfiles.map(x => ({platforms: platforms, dockerfile: {path: x.path, tag: "", image: "", wd: "/"}})));
                setDockerfiles(dockerfiles.map(x => x.path))
            })()
        }
    }, [username, repository, branch, platforms])


    function update(event: React.ChangeEvent<{ value: any }>, key: keyof DockerfilesParams[number]["dockerfile"], index: number) {
        const clone = deepClone(conf);
        const dockerfileConf = clone[index].dockerfile;
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
        onChanges.dockerfiles(configuration.map(c => {
            return {
                ...c,
                dockerfile: {
                    ...c.dockerfile,
                    wd: c.dockerfile.image.slice(c.dockerfile.image.indexOf(":") + 1),
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
                        onChange={e => update(e, "wd", index)}
                    />


                    <TextField
                        className={"FormControl"}
                        id={`mapping-create-image-input-${index}`}
                        label="Image name"
                        value={conf.dockerfile.image}
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


                </Box>


            </>)}


        </Container>


    </div>
}

