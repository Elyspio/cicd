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

const mapStateToProps = (state: RootState) => ({})

const mapDispatchToProps = (dispatch: Dispatch) => ({})

const connector = connect(mapStateToProps, mapDispatchToProps);
type ReduxTypes = ConnectedProps<typeof connector>;


const Test = (props: ReduxTypes) => {


    const [msg, setMsg] = React.useState("");
    const [admin, setAdmin] = React.useState("");

    const [envs, setEnvs] = React.useState<{ [key in string]: string }>({});

    React.useEffect(() => {
        const fetchData = async () => {
            const {data} = await Services.test.getContent();
            setMsg(data)
        }
        fetchData();
        fetchEnvironments();
    }, [])


    const fetchAdmin = async () => {
        const data = await Services.test.getAdminContent();
        if (data) {
            setAdmin(data)
        }
    }

    const fetchEnvironments = async () => {
        setEnvs(await Services.environments.getServerEnvironmentsVariables())

    }


    const columns = [
        {field: 'name', headerName: 'Name', width: 300},
        {field: 'content', headerName: 'Content', width: 800},

    ];

    const rows = Object.keys(envs).map(k => ({id: k, name: k, content: envs[k]}))


    return (
        <Container className={"Test"}>
            <Typography variant={"h6"}>Test</Typography>
            <Typography>msg: {msg}</Typography>

            <Button onClick={fetchAdmin}>Admin content</Button>
            {admin && <Typography>admin response: {admin}</Typography>}

            <div style={{marginTop: "2rem"}}>
                <Typography variant={"h6"}>Environments: ({Object.keys(envs).length})</Typography>
                <DataGrid rows={rows} columns={columns} pagination={true} autoHeight={true} pageSize={10}/>
            </div>


        </Container>
    );

}


export default connector(Test);
