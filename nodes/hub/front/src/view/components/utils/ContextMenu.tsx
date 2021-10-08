import * as React from "react";
import { ReactNode } from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

export type ContextMenuItems = {
	label: ReactNode;
	onClick?: () => void;
	autoClose?: boolean;
}[];
type ContextMenuProps = {
	children: ReactNode;
	items: ContextMenuItems;
};

export function ContextMenu({ children, items }: ContextMenuProps) {
	const [contextMenu, setContextMenu] = React.useState<{
		mouseX: number;
		mouseY: number;
	} | null>(null);

	const handleContextMenu = (event: React.MouseEvent) => {
		event.preventDefault();
		setContextMenu(
			contextMenu === null
				? {
						mouseX: event.clientX - 2,
						mouseY: event.clientY - 4,
				  }
				: // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
				  // Other native context menus might behave different.
				  // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
				  null
		);
	};

	const handleClose = () => {
		setContextMenu(null);
	};

	function getOnClick(item: ContextMenuItems[number]) {
		return () => {
			if (item.autoClose !== false) handleClose();
			if (item.onClick) item.onClick();
		};
	}

	return (
		<div onContextMenu={handleContextMenu} style={{ cursor: "context-menu" }}>
			{children}
			<Menu
				open={contextMenu !== null}
				onClose={handleClose}
				anchorReference="anchorPosition"
				anchorPosition={contextMenu !== null ? { top: contextMenu.mouseY, left: contextMenu.mouseX } : undefined}
			>
				{items.map((item) => (
					<MenuItem onClick={getOnClick(item)}>{item.label}</MenuItem>
				))}
			</Menu>
		</div>
	);
}
