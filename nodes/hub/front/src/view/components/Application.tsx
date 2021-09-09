import * as React from 'react';
import {Box} from "@material-ui/core";
import "./Application.scss"
import {connect, ConnectedProps} from "react-redux";
import {Dispatch} from "redux";
import {toggleTheme} from "../store/module/theme/action";
import Brightness5Icon from '@material-ui/icons/Brightness5';
import {Drawer} from "./utils/drawer/Drawer"
import {StoreState} from "../store";
import {Automate} from "./automate/Automate";
import {AccountCircle} from "@material-ui/icons";
import {Services} from "../../core/services";

const mapStateToProps = (state: StoreState) => ({theme: state.theme.current})

const mapDispatchToProps = (dispatch: Dispatch) => ({toggleTheme: () => dispatch(toggleTheme())})

const connector = connect(mapStateToProps, mapDispatchToProps);
type ReduxTypes = ConnectedProps<typeof connector>;

export interface Props {
}


function Application(props: Props & ReduxTypes) {

	const actions = [{
		onClick: props.toggleTheme,
		text: "Switch lights",
		icon: <Brightness5Icon/>
	}, {
		onClick: Services.authentication.login,
		text: "Login",
		icon: <AccountCircle/>
	}]

	return (
		<Box className={"Application"}>
			<Drawer position={"right"}
			        actions={actions}>
				<div className="content">
					<Automate/>
				</div>
			</Drawer>
		</Box>
	);
}

export default connector(Application)
