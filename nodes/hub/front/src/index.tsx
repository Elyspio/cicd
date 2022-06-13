import "reflect-metadata";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import { connect, ConnectedProps, Provider } from "react-redux";
import { history, store, StoreState } from "./view/store";
import Application from "./view/components/Application";
import { CssBaseline, StyledEngineProvider, Theme, ThemeProvider } from "@mui/material";
import { themes } from "./config/theme";
import { ConnectedRouter } from "connected-react-router";
import "./config/window.d.ts";
import { Provider as DiProvider } from "inversify-react";
import { container } from "./core/di";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

declare module "@mui/styles/defaultTheme" {
	// eslint-disable-next-line @typescript-eslint/no-empty-interface
	interface DefaultTheme extends Theme {
	}
}

const mapStateToProps = (state: StoreState) => ({ theme: state.theme.current });

const connector = connect(mapStateToProps);
type ReduxTypes = ConnectedProps<typeof connector>;

class Wrapper extends Component<ReduxTypes> {
	render() {
		const theme = this.props.theme === "dark" ? themes.dark : themes.light;

		return (
			<DiProvider container={container}>
				<StyledEngineProvider injectFirst>
					<ThemeProvider theme={theme}>
						<Application />
						<ToastContainer theme={this.props.theme === "dark" ? "dark" : "colored"} />
						<CssBaseline />
					</ThemeProvider>
				</StyledEngineProvider>
			</DiProvider>
		);
	}
}

const ConnectedWrapper = connector(Wrapper) as any;

ReactDOM.render(
	<Provider store={store}>
		<ConnectedRouter history={history}>
			<ConnectedWrapper />
		</ConnectedRouter>
	</Provider>,
	document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
