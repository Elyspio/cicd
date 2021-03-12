import React from "react";
import {connect, ConnectedProps} from "react-redux";
import {Dispatch} from "redux";
import {StoreState} from "../../../store";
import List from "@material-ui/core/List";
import {AgentItem} from "./AgentItem";


export function Agents(props: ReduxTypes) {

    const agents = React.useMemo(() => {

        return {
            builder: [...props.agents?.builder ?? []].sort((a, b) => a.uri.localeCompare(b.uri)),
            production: [...props.agents?.production ?? []].sort((a, b) => a.uri.localeCompare(b.uri)),
        }

    }, [props.agents?.builder, props.agents?.production])

    return <List className={"Agents"}>
        {agents.builder.map(builder => <AgentItem data={builder} type={"builder"}/>)}
        {agents.production.map(builder => <AgentItem data={builder} type={"production"}/>)}
    </List>
}


const mapStateToProps = (state: StoreState) => ({
    agents: state.automation.config?.agents
})

const mapDispatchToProps = (dispatch: Dispatch) => ({})

const connector = connect(mapStateToProps, mapDispatchToProps);
type ReduxTypes = ConnectedProps<typeof connector>;


export default connector(Agents)
