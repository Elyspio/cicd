
import React from "react";
import {Typography} from "@material-ui/core";
import {MappingCreateSources} from "./MappingCreateSources";
import "./MappingCreate.scss";
import {DockerfilesParams, MappingCreateImages} from "./MappingCreateImages";




export function MappingCreate() {

    const [branch, setBranch] = React.useState<string | undefined>()
    const [repo, setRepo] = React.useState<string | undefined>()
    const [username, setUsername] = React.useState<string | undefined>()
    const [dockerfiles, setDockerFiles] = React.useState<DockerfilesParams>([])

    return <div className="MappingCreate">


        <Typography variant={"h4"} align={"center"}>Create a new mapping</Typography>

        <MappingCreateSources onChanges={{repo: setRepo, branch: setBranch, username: setUsername}}/>

        {username && repo && branch && <MappingCreateImages
            onChanges={{dockerfiles: setDockerFiles}}
            sources={{branch, username, repository: repo}}
        />}


    </div>
}

