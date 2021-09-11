import React, {CSSProperties, ReactNode} from "react"
import {Grid, Typography, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import "./Chip.scss"
import {useAppSelector} from "../../../store";

type Props = {
	label: ReactNode,
	icon?: ReactNode,
	title?: string
	color?: string,
	className?: string
	fontWeight?: "bold",
	onClick?: () => void
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
	},
}));


export function CustomChip({onClick, icon, label, title, color, className, fontWeight}: Props) {

	const appTheme = useTheme();
	const classes = useStyles();

	const theme = useAppSelector(s => s.theme.current);

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

	return <Grid
		container
		onClick={onClick}
		title={title}
		className={`Chip ${className ?? ""} ${classes.chip}`}
		wrap={"nowrap"}
		style={{...style, fontWeight: fontWeight,}}>
		<Grid item xs={1}>
			{icon}
		</Grid>
		<Grid item xs={11}>
			<Typography component={"p"} variant={"subtitle2"}>{label}</Typography>
		</Grid>
	</Grid>
}


