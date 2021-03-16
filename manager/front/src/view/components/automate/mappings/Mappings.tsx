import React from "react";
import {connect, ConnectedProps} from "react-redux";
import {Dispatch} from "redux";
import {StoreState} from "../../../store";
import List from "@material-ui/core/List";
import {Mapping} from "./Mapping";


export function Mappings(props: ReduxTypes) {

    const mappings = React.useMemo(() => {
        return [...props.mappings ?? []].sort((a, b) => a.id > b.id ? -1 : 1)

    }, [props.mappings])

    return <List className={"Mappings"}>
        {mappings.map((agent, index) => <Mapping key={`M-${agent.id}`} data={agent}/>)}
    </List>
}


const mapStateToProps = (state: StoreState) => ({
    mappings: state.automation.config?.mappings
})

const mapDispatchToProps = (dispatch: Dispatch) => ({})

const connector = connect(mapStateToProps, mapDispatchToProps);
type ReduxTypes = ConnectedProps<typeof connector>;


export default connector(Mappings)
