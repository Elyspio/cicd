import {Dispatch} from "redux";
import {connect, ConnectedProps} from "react-redux";
import {Container} from "@material-ui/core";
import "./Test.scss"
import Typography from "@material-ui/core/Typography";
import Button from '@material-ui/core/Button';
import {Services} from "../../../core/services";
import * as React from 'react';
import {DataGrid} from '@material-ui/data-grid';
import {managerSocket} from "../../../core/services/socket";
import {StoreState} from "../../store";

const mapStateToProps = (state: StoreState) => ({
    config: state.automation.config
})

const mapDispatchToProps = (dispatch: Dispatch) => ({})

const connector = connect(mapStateToProps, mapDispatchToProps);
type ReduxTypes = ConnectedProps<typeof connector>;




const Test = (props: ReduxTypes) => {



    return (
        <Container className={"Test"}>
            <code>{JSON.stringify(props.config, undefined, 4)}</code>
        </Container>
    );

}


export default connector(Test);
