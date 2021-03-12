import React from "react";
import {Avatar, Chip, ListItem, ListItemAvatar, ListItemText, Typography, useTheme} from "@material-ui/core";
import {BuildAgent as IBuildAgent, Agent} from "../../../../../../back/src/core/services/manager/types";
import FolderIcon from '@material-ui/icons/Folder';
import MapIcon from '@material-ui/icons/Map';
import {StoreState} from "../../../store";
import {Dispatch} from "redux";
import {connect, ConnectedProps} from "react-redux";

type Props = {
    data: Agent
    type: "builder" | "production"
}


type StatusChipProps = StatusChipReduxTypes &{
    status: Agent["availability"]
}

function StatusChip({status, theme}: StatusChipProps) {

    const  {palette} = useTheme();

    const texts: { [key in typeof status]: { label: string, color: string } } = {
        down: {label: "Down", color: palette.error[theme]},
        free: {label: "Available", color: palette.success[theme]},
        running: {label: "Working", color: palette.primary[theme]},
    }

    return <Chip label={texts[status].label} style={{backgroundColor: texts[status].color, fontWeight: "bold", fontSize: "90%"}}/>

}

const mapStateToProps = (state: StoreState) => ({
    theme: state.theme.current
})

const mapDispatchToProps = (dispatch: Dispatch) => ({})

const connector = connect(mapStateToProps, mapDispatchToProps);
type StatusChipReduxTypes = ConnectedProps<typeof connector>;
const StatusChipWithStore = connector(StatusChip)

export function AgentItem(props: Props) {
    return <ListItem>
        <ListItemAvatar>
            <Avatar>
                {props.type === "production" ? <FolderIcon/> : <MapIcon/>}
            </Avatar>
        </ListItemAvatar>
        <ListItemText
            primary={props.data.uri}
            secondary={<Typography>Status: <StatusChipWithStore status={props.data.availability}/></Typography>}
        />
    </ListItem>
}
