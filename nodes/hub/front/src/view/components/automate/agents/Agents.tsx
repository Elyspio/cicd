import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { Dispatch } from "redux";
import { StoreState } from "../../../store";
import List from "@mui/material/List";
import { AgentItem } from "./AgentItem";

export function Agents(props: ReduxTypes) {
	const agents = React.useMemo(() => {
		return {
			builds: [...(props.agents?.builds ?? [])].sort((a, b) => a.url.localeCompare(b.url)),
			deployments: [...(props.agents?.deploys ?? [])].sort((a, b) => a.url.localeCompare(b.url)),
		};
	}, [props.agents?.builds, props.agents?.deploys]);

	return (
		<List className={"Agents"}>
			{agents.builds.map((agent, index) => (
				<AgentItem key={`b-${agent.url}-${index}`} data={agent} type={"builder"} />
			))}
			{agents.deployments.map((agent, index) => (
				<AgentItem key={`p-${agent.url}-${index}`} data={agent} type={"production"} />
			))}
		</List>
	);
}

const mapStateToProps = (state: StoreState) => ({
	agents: state.automation.config?.agents,
});

const mapDispatchToProps = (dispatch: Dispatch) => ({});

const connector = connect(mapStateToProps, mapDispatchToProps);
type ReduxTypes = ConnectedProps<typeof connector>;

export default connector(Agents);
