import * as React from 'react';
import {Box} from "@material-ui/core";
import "./Application.scss"
import {useDispatch} from "react-redux";
import {Automate} from "./automate/Automate";
import {login as loginAction, logout, silentLogin} from '../store/module/authentication/authentication.action';
import {toggleTheme as toggleThemeAction} from "../store/module/theme/theme.action";
import {useAppSelector} from "../store";
import Login from '@material-ui/icons/AccountCircle';
import {ReactComponent as Logout} from "../icons/logout.svg"
import {createDrawerAction, withDrawer} from "./utils/drawer/Drawer.hoc";
import Brightness5Icon from '@material-ui/icons/Brightness5';
import Brightness3Icon from '@material-ui/icons/Brightness3';
import {updateToastTheme} from "./utils/toast";

function Application() {

	const dispatch = useDispatch();
	const {logged, theme, themeIcon} = useAppSelector(s => ({
		logged: s.authentication.logged,
		theme: s.theme.current,
		themeIcon: s.theme.current === "dark" ? <Brightness5Icon/> : <Brightness3Icon/>,
	}))

	const login = React.useCallback(() => dispatch(logged ? logout() : loginAction()), [logged, dispatch])
	const toggleTheme = React.useCallback(() => dispatch(toggleThemeAction()), [dispatch])


	React.useEffect(() => updateToastTheme(theme), [theme])

	React.useEffect(() => {
		dispatch(silentLogin())
	}, [dispatch])

	const actions = [
		createDrawerAction(theme === "dark" ? "Light Mode" : "Dark Mode", {
			icon: themeIcon,
			onClick: () => dispatch(toggleTheme()),
		}),
	]


	if (logged) {
		actions.push(createDrawerAction("Logout", {
			icon: <Logout fill={"currentColor"}/>,
			onClick: () => dispatch(logout()),
		}))
	} else {
		actions.push(createDrawerAction("Login", {
			icon: <Login fill={"currentColor"}/>,
			onClick: () => dispatch(login()),
		}))
	}

	const drawer = withDrawer({
		component: <Automate/>,
		actions,
		title: "CICD"
	})


	return <Box className={"Application"} bgcolor={"background.default"}>
		{drawer}
	</Box>;
}

export default Application
