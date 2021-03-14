import {connect, ConnectedProps} from "react-redux";
import {Dispatch} from "redux";
import {StoreState} from "../../store";
import {Paper, Typography} from "@material-ui/core";
import React from "react";
import {SimpleAccordion} from "../utils/SimpleAccordion";
import Agents from "./agents/Agents";
import {makeStyles} from "@material-ui/core/styles";
import Jobs from "./jobs/Jobs";
import {Route, Switch} from 'react-router'
import JobBuildDetail from "./jobs/detail/JobBuildDetail";
import JobDeployDetail from "./jobs/detail/JobDeployDetail";
import Mappings from "./mappings/Mappings";

const mapStateToProps = (state: StoreState) => ({})

const mapDispatchToProps = (dispatch: Dispatch) => ({})

const connector = connect(mapStateToProps, mapDispatchToProps);
type ReduxTypes = ConnectedProps<typeof connector>;


const useStyles = makeStyles((theme) => ({
    root: {
        height: "100%",
        width: "100%",
        display: "flex"
    },
    left: {
        width: '30%',
        minWidth: "30%",
        maxHeight: "100vh",
        overflow: "auto",
        padding: 20,
    },
    right: {
        width: '100%',
        padding: 20

    }

}));

export function Automate(props: ReduxTypes) {

    const classes = useStyles()
    // const [accordionState, setAccordionState] = React.useState(defaultState)

    return <Paper className={classes.root}>

        <Paper className={classes.left}>
            <SimpleAccordion label={"Agents"}>
                <Agents/>
            </SimpleAccordion>

            <SimpleAccordion label={"Jobs"}>
                <Jobs/>
            </SimpleAccordion>

            <SimpleAccordion label={"Mappings"}>
                <Mappings/>
            </SimpleAccordion>

        </Paper>
        <Paper className={classes.right}>
            <Switch>
                <Route exact path="/job/build/:id" render={({match: {params: {id}}}) => id && <JobBuildDetail id={Number.parseInt(id)}/>}/>
                <Route exact path="/job/deploy/:id" render={({match: {params: {id}}}) => id && <JobDeployDetail id={Number.parseInt(id)}/>}/>
                <Route render={() => <Typography>Please select one item on the left to see its details</Typography>}/>
            </Switch>
        </Paper>

    </Paper>
}

export const reactRouterPath = {
    getBuildPath(id: number) {
        return `/job/build/${id}`
    },
    getDeployPath(id: number) {
        return `/job/deploy/${id}`
    }
}
