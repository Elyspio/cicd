import React from "react";
import {Container, FormControl, IconButton, InputLabel, MenuItem, Select, Typography} from "@material-ui/core";
import {Add} from "@material-ui/icons";


import {connect, ConnectedProps} from "react-redux";
import {Dispatch} from "redux";
import {StoreState} from "../../../../store";
import {Apis} from "../../../../../core/apis";
import {ProductionApplications} from "../../../../../core/apis/back";
import {Deployment} from "../../../../store/module/automation/types";
import {deepClone} from "../../../../../core/util/data";
import {ReactComponent as DockerIcon} from "../../icons/docker.svg";


const mapStateToProps = (state: StoreState) => ({
	agents: state.automation.config?.agents.production ?? []
})

const mapDispatchToProps = (dispatch: Dispatch) => ({})

const connector = connect(mapStateToProps, mapDispatchToProps);
type ReduxTypes = ConnectedProps<typeof connector>;


type Props = ReduxTypes & {};


function MappingCreateDeployment(props: Props) {


	const [apps, setApps] = React.useState<ProductionApplications[]>([]);

	const [deployments, setDeployments] = React.useState<Partial<Deployment>[]>([])

	React.useEffect(() => {
		(async () => {
			const apps = await Apis.core.automate.automationGetProductionApps().then(x => x.data)
			setApps(apps)
		})()
	}, [])

	const addDeployment = React.useCallback(() => {
		setDeployments([...deepClone(deployments), {}])
	}, [deployments])


	const onAgentSelection = React.useCallback((e, index) => {
		const uri = e.target.value;
		const dep = deployments[index];
		dep.agent = props.agents.find(app => app.uri === uri)!!
	}, [props.agents, deployments])

	const onDockerComposeSelection = React.useCallback((e, index) => {
		const path = e.target.value;
		const dep = deployments[index];
		dep.config = {
			uri: dep.agent!.uri,
			docker: {
				compose: {
					path
				}
			}
		}
	}, [props.agents, deployments])

	const size = 16

	return <div className="MappingCreateDeployment">
		<Container className={"Container"}>
			<Typography variant={"h6"}>Deployments <IconButton color={"primary"} onClick={addDeployment}><Add/></IconButton></Typography>
			{deployments.map((dep, index) => <div>

				<FormControl className={"FormControl"}>
					<InputLabel id={`mapping-create-image-platform-label-${index}`}>Agent</InputLabel>
					<Select
						labelId={`mapping-create-deployment-agent-label-${index}`}
						id={`mapping-create-deployment-agent-input-${index}`}
						value={dep.agent?.uri ?? ""}
						onChange={(e) => onAgentSelection(e, index)}
						renderValue={(value) => <div><DockerIcon width={size} height={size}/> {value}</div>}
						required
					>
						{apps.map(app => <MenuItem
							value={app.agent.uri}
							key={app.agent.uri}>
							{app.agent.uri}
						</MenuItem>)}
					</Select>
				</FormControl>

				{dep.agent && <FormControl className={"FormControl"}>
                    <InputLabel id={`mapping-create-image-platform-label-${index}`}>docker-compose.yml path</InputLabel>
                    <Select
                        labelId={`mapping-create-deployment-app-label-${index}`}
                        id={`mapping-create-deployment-app-input-${index}`}
                        value={dep.config?.docker?.compose?.path ?? ""}
                        onChange={(e) => onDockerComposeSelection(e, index)}
                        required
                    >
						{apps.find(app => dep.agent?.uri === app.agent.uri)?.apps?.map(app => <MenuItem
							value={app}
							key={app}>
							{app}
						</MenuItem>)}
                    </Select>
                </FormControl>}

			</div>)}

		</Container>

	</div>
}


export default connector(MappingCreateDeployment)
