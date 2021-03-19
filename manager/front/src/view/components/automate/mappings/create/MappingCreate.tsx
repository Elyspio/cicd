import {StoreState} from "../../../../store";
import {Dispatch} from "redux";
import {connect, ConnectedProps} from "react-redux";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Typography} from "@material-ui/core";
import {MappingCreateSources} from "./MappingCreateSources";
import "./MappingCreate.scss";
import {DockerfilesParams, MappingCreateImages} from "./MappingCreateImages";
import {BuildConfig} from "../../../../../../../back/src/core/services/manager/types";

const mapStateToProps = (state: StoreState) => ({})

const mapDispatchToProps = (dispatch: Dispatch) => ({})

const connector = connect(mapStateToProps, mapDispatchToProps);
type ReduxTypes = ConnectedProps<typeof connector>;


const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 240,
        marginRight: 30
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },

    container: {
        marginTop: 40,
        "& h6": {
            marginBottom: 10
        },
        "& .MuiFormControl-root": {
            marginLeft: 0
        }
    }
}));

function MappingCreate_(props: ReduxTypes) {

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

export const MappingCreate = connector(MappingCreate_);
