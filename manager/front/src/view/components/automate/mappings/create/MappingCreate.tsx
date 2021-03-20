import React from "react";
import {Typography} from "@material-ui/core";
import MappingCreateSources from "./MappingCreateSources";
import "./MappingCreate.scss";
import MappingCreateImages from "./MappingCreateBuilds";
import MappingCreateDeployment from "./MappingCreateDeployment";


import {connect, ConnectedProps} from "react-redux";
import {Dispatch} from "redux";
import {StoreState} from "../../../../store";


const mapStateToProps = (state: StoreState) => ({
    ...state.automation.sources
})

const mapDispatchToProps = (dispatch: Dispatch) => ({})

const connector = connect(mapStateToProps, mapDispatchToProps);
type ReduxTypes = ConnectedProps<typeof connector>;


type Props = ReduxTypes & {};


function MappingCreate({branch, username, repository}: Props) {


    return <div className="MappingCreate">


        <Typography variant={"h4"} align={"center"}>Create a new mapping</Typography>

        <MappingCreateSources/>

        {username && repository && branch && <MappingCreateImages

        />}

        <MappingCreateDeployment/>

    </div>
}

export default connector(MappingCreate)

