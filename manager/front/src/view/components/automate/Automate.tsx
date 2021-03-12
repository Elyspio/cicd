import {connect, ConnectedProps} from "react-redux";
import {Dispatch} from "redux";
import {StoreState} from "../../store";
import {Paper} from "@material-ui/core";
import React from "react";
import {SimpleAccordion} from "../utils/SimpleAccordion";
import Agents from "./agents/Agents";
import {makeStyles} from "@material-ui/core/styles";

const mapStateToProps = (state: StoreState) => ({})

const mapDispatchToProps = (dispatch: Dispatch) => ({})

const connector = connect(mapStateToProps, mapDispatchToProps);
type ReduxTypes = ConnectedProps<typeof connector>;


// type AccordionsState = {
//     agents: boolean,
//     jobs: boolean,
//     mappings: boolean,
//     queues: boolean
// }
//
// const defaultState: AccordionsState = {
//     agents: false,
//     jobs: false,
//     mappings: false,
//     queues: false
// }
const useStyles = makeStyles((theme) => ({
    root: {
        height: "100%",
        width: "100%",
        display: "flex"
    },
    left: {
        width: '30%',
        padding: 20,
    },
    right: {
        width: '70%',
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

            </SimpleAccordion>

            <SimpleAccordion label={"Mappings"}>

            </SimpleAccordion>

            <SimpleAccordion label={"Queues"}>

            </SimpleAccordion>
        </Paper>
        <Paper className={classes.right}>

        </Paper>

    </Paper>
}
