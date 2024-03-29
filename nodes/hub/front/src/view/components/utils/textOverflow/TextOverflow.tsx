import React from "react";
import { Typography, TypographyProps } from "@mui/material";
import "./TextOverflow.scss";

type Props = {
	text: string;
};

function TextOverflow(props: Props & TypographyProps) {
	return (
		<Typography {...props} className={"TextOverflow " + (props.className ?? "")}>
			<Typography component={"span"}>{props.text}</Typography>
		</Typography>
	);
}

export default TextOverflow;
