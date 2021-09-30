import React from "react";
import { SimpleAccordion } from "../../utils/SimpleAccordion";
import Mappings from "./Mappings";
import { Box, IconButton, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import createStyles from "@mui/styles/createStyles";
import makeStyles from "@mui/styles/makeStyles";
import { connect, ConnectedProps } from "react-redux";
import { Dispatch } from "redux";
import { StoreState } from "../../../store";
import { push } from "connected-react-router";

const useStyles = makeStyles(() =>
	createStyles({
		header: {
			display: "flex",
			justifyContent: "space-between",
			alignItems: "center",
			width: "100%",
		},
		btns: {
			display: "flex",
			alignItems: "center",
		},
	}),
);

const Header = (props: {
	onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any;
}) => {
	const classes = useStyles();
	return (
		<Box className={classes.header}>
			<Typography>Mapping</Typography>
			<div className={classes.btns}>
				<IconButton
					color={"primary"}
					onClick={(e) => props.onClick(e)}
					size="medium"
				>
					<Add />
				</IconButton>
			</div>
		</Box>
	);
};

const mapStateToProps = (state: StoreState) => ({});

const mapDispatchToProps = (dispatch: Dispatch) => ({
	addMapping: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
		e.stopPropagation();
		dispatch(push("/mapping/add"));
	},
});

const connector = connect(mapStateToProps, mapDispatchToProps);
type ReduxTypes = ConnectedProps<typeof connector>;

const MappingAccordion = (props: ReduxTypes) => (
	<SimpleAccordion label={<Header onClick={props.addMapping} />}>
		<Mappings />
	</SimpleAccordion>
);

export default connector(MappingAccordion);
