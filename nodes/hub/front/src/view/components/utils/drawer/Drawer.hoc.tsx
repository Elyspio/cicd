import React from "react";
import {ActionComponent, ActionComponentProps, ActionDescription, ActionDescriptionProps} from "./actions/Action";
import {Box} from "@material-ui/core";
import {Drawer} from "./Drawer";
import "./actions/Actions.scss"

export type WithDrawerProps = {
	component: React.ReactNode,
	actions: {
		component: ActionComponentProps,
		description: ActionDescriptionProps
	}[],
	title: string

}

function Actions(props: { elements: WithDrawerProps["actions"] }) {
	return <Box className={"Actions"}>
		{props.elements.map(action => <ActionComponent key={action.description.children?.toString()}  {...action.component}>
			<ActionDescription children={action.description.children}/>
		</ActionComponent>)}
	</Box>;
}


export function withDrawer({component, title, actions}: WithDrawerProps) {


	return <Box className={"Drawer-hoc"}>
		<Drawer position={"right"} actionsComponent={<Actions elements={actions}/>}>
			<div className="content">
				{component}
			</div>
		</Drawer>
	</Box>

}

export function createDrawerAction(name: string, config: ActionComponentProps): WithDrawerProps["actions"][number] {
	return {
		description: {children: name},
		component: config
	}
}