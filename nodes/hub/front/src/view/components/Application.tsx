import * as React from 'react';
import {Box} from "@material-ui/core";
import "./Application.scss"
import {useDispatch} from "react-redux";
import Brightness5Icon from '@material-ui/icons/Brightness5';
import {Drawer} from "./utils/drawer/Drawer"
import {Automate} from "./automate/Automate";
import {AccountCircle} from "@material-ui/icons";
import {login as loginAction, logout} from '../store/module/authentication/authentication.action';
import {toggleTheme as toggleThemeAction} from "../store/module/theme/theme.action";
import {useAppSelector} from "../store";

function Application() {

	const dispatch = useDispatch();
	const logged = useAppSelector(s => s.authentication.logged)

	const login = React.useCallback(() => dispatch(logged ? logout() : loginAction()), [dispatch])
	const toggleTheme = React.useCallback(() => dispatch(toggleThemeAction()), [dispatch])

	const actions = [{
		onClick: toggleTheme,
		text: "Switch lights",
		icon: <Brightness5Icon/>
	}, {
		onClick: login,
		text: logged ? "Logout" : "Login",

		icon: <AccountCircle/>
	}]

	return <Box className={"Application"}>
		<Drawer position={"right"}
		        actions={actions}>
			<div className="content">
				<Automate/>
			</div>
		</Drawer>
	</Box>;
}

export default Application
