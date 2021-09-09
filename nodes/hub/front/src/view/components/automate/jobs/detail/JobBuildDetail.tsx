import {connect, ConnectedProps} from "react-redux";
import {Dispatch} from "redux";
import {StoreState} from "../../../../store";
import React from "react";

const mapStateToProps = (state: StoreState, props: OwnProps) => ({
	job: state.automation.config?.jobs.builds.find(b => b.id === props.id)!!
})

const mapDispatchToProps = (dispatch: Dispatch) => ({})

const connector = connect(mapStateToProps, mapDispatchToProps);
type ReduxTypes = ConnectedProps<typeof connector>;

type OwnProps = {
	id: number
};
type Props = ReduxTypes & OwnProps


export function JobBuildDetail({job}: Props) {


	return <div className={"JobBuildDetail"}>
		{job?.id}
	</div>
}

export default connector(JobBuildDetail)
