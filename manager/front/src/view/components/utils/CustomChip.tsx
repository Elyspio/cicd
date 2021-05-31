import React, {CSSProperties, ReactNode} from "react"
import {Chip, useTheme} from "@material-ui/core";
import {StoreState} from "../../store";
import {connect, ConnectedProps} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";

type Props = ReduxTypes & {
	label: ReactNode,
	title?: string
	color?: string,
	className?: string
	fontWeight?: "bold"
}

const useStyles = makeStyles((theme) => ({
	chip: {
		"& span": {
			display: "flex",
			alignItems: "center",
			"& svg": {
				marginRight: "0.5rem"
			}
		},
		fontSize: "90%"
	},
}));


function CustomChip_({label, title, theme, color, className, fontWeight}: Props) {

	const appTheme = useTheme();
	const classes = useStyles();
	if (!color) {
		color = appTheme.palette.grey[theme]
	}

	const style: CSSProperties = theme === "light"
		? {
			backgroundColor: color
		}
		: {
			color: color
		}

	return <Chip
		component={"span"}
		title={title}
		className={`Chip ${className ?? ""} ${classes.chip}`}
		variant={theme === "dark" ? "outlined" : undefined}
		label={label}
		style={{...style, fontWeight: fontWeight,}}/>
}

const mapStateToProps = (state: StoreState) => ({
	theme: state.theme.current
})


const connector = connect(mapStateToProps, () => ({}));
type ReduxTypes = ConnectedProps<typeof connector>;

export const CustomChip = connector(CustomChip_);
