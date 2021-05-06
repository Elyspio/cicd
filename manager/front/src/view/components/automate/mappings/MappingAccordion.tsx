import React from 'react';
import {SimpleAccordion} from "../../utils/SimpleAccordion";
import Mappings from "./Mappings";
import {IconButton, Typography} from "@material-ui/core";
import {Add} from "@material-ui/icons";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";
import {connect, ConnectedProps} from "react-redux";
import {Dispatch} from "redux";
import {StoreState} from "../../../store";
import {push} from 'connected-react-router';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		header: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			width: "100%"
		},
		btns: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center"
		}
	}),
);


const Header = (props: { onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any }) => {
	const classes = useStyles();
	return <div className={classes.header}>
		<Typography>Mapping</Typography>
		<div className={classes.btns}>
			<IconButton color={"primary"} onClick={e => props.onClick(e)}><Add/></IconButton>
		</div>
	</div>
}


const mapStateToProps = (state: StoreState) => ({})

const mapDispatchToProps = (dispatch: Dispatch) => ({
	addMapping: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.stopPropagation();
		dispatch(push("/mapping/add"));
	}
})

const connector = connect(mapStateToProps, mapDispatchToProps);
type ReduxTypes = ConnectedProps<typeof connector>;


const MappingAccordion = (props: ReduxTypes) => (
	<SimpleAccordion label={<Header onClick={props.addMapping}/>}>
		<Mappings/>
	</SimpleAccordion>
);

export default connector(MappingAccordion);
