import {RootState} from "../../store/reducer";
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

const mapStateToProps = (state: RootState) => ({})

const mapDispatchToProps = (dispatch: Dispatch) => ({})

const connector = connect(mapStateToProps, mapDispatchToProps);
type ReduxTypes = ConnectedProps<typeof connector>;




const Test = (props: ReduxTypes) => {

    const [msg, setMsg] = React.useState(Array<String>());


    React.useEffect(() => {
        managerSocket.on("front-job-stdout", (args) => {
            setMsg([...msg, JSON.stringify(args[1])])
        })

    }, [msg])


    return (
        <Container className={"Test"}>
            <Typography variant={"h6"}>Test</Typography>
            <Typography>msg: {msg}</Typography>
        </Container>
    );

}


export default connector(Test);
