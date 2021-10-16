import React, { ReactNode } from "react";
import { Box, BoxProps } from "@mui/material";

type AutoScrollProps = BoxProps & {
	to: "top" | "bottom";
	children: ReactNode;
	length: number;
};

export function AutoScroll(props: AutoScrollProps) {
	const ref = React.useRef<HTMLElement>();

	React.useEffect(() => {
		if (ref.current) {
			for (const child of ref.current.children) {
				child.scrollIntoView({
					block: props.to === "top" ? "start" : "end",
				});
			}
		}
	}, [ref, props.length, props.to]);

	return (
		<Box {...props} ref={ref}>
			{props.children}
		</Box>
	);
}
