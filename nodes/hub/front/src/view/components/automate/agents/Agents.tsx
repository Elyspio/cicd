import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { Dispatch } from "redux";
import { StoreState } from "../../../store";
import List from "@mui/material/List";
import { AgentItem } from "./AgentItem";

export function Agents(props: ReduxTypes) {
	const agents = React.useMemo(() => {
		return {
			builds: [...(props.agents?.builds ?? [])].sort((a, b) => a.uri.localeCompare(b.uri)),
			deployments: [...(props.agents?.deployments ?? [])].sort((a, b) => a.uri.localeCompare(b.uri)),
		};
	}, [props.agents?.builds, props.agents?.deployments]);

	return (
		<List className={"Agents"}>
			{agents.builds.map((agent, index) => (
				<AgentItem key={`b-${agent.uri}-${index}`} data={agent} type={"builder"} />
			))}
			{agents.deployments.map((agent, index) => (
				<AgentItem key={`p-${agent.uri}-${index}`} data={agent} type={"production"} />
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
