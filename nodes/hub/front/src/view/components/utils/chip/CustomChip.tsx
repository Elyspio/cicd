import React, { CSSProperties, ReactNode } from "react";
import { Grid, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/material/styles";
import "./Chip.scss";
import { useAppSelector } from "../../../store";

const PREFIX = "CustomChip";

const classes = {
	chip: `${PREFIX}-chip`,
};

const StyledGrid = styled(Grid)(({ theme }) => ({
	[`& .${classes.chip}`]: {
		"& span": {
			display: "flex",
			alignItems: "center",
			"& svg": {
				marginRight: "0.5rem",
			},
		},
	},
}));

type Props = {
	label: ReactNode;
	icon?: ReactNode;
	title?: string;
	color?: string;
	className?: string;
	fontWeight?: "bold";
	onClick?: () => void;
	item?: boolean;
};

export function CustomChip({ onClick, icon, label, title, color, className, fontWeight, item }: Props) {
	const appTheme = useTheme();
	const theme = useAppSelector((s) => s.theme.current);

	if (!color) {
		color = appTheme.palette.grey["400"] as string;
	}

	const style: CSSProperties =
		theme === "light"
			? {
					backgroundColor: color,
			  }
			: {
					color: color,
			  };

	return (
		<StyledGrid container onClick={onClick} title={title} className={`Chip ${className ?? ""} ${classes.chip}`} wrap={"nowrap"} item={item} style={{ ...style, fontWeight: fontWeight }}>
			<Grid item xs={1}>
				{icon}
			</Grid>
			<Grid item xs={11}>
				<Typography component={"p"} variant={"subtitle2"}>
					{label}
				</Typography>
			</Grid>
		</StyledGrid>
	);
}
