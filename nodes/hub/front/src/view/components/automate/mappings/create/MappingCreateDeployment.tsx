import React from "react";
import {Box, FormControl, IconButton, InputLabel, MenuItem, Select, Typography} from "@material-ui/core";
import {Add} from "@material-ui/icons";
import {useAppSelector} from "../../../../store";
import {deepClone} from "../../../../../core/utils/data";
import {ReactComponent as DockerIcon} from "../../icons/docker.svg";
import {useInjection} from "inversify-react";
import {DiKeysService} from "../../../../../core/di/di.keys.service";
import {AutomateService} from "../../../../../core/services/cicd/automate.cicd.service";
import {ProductionApplications} from "../../../../../core/apis/backend/generated";
import {Deployment} from "../../../../store/module/automation/types";


function MappingCreateDeployment() {

	const [apps, setApps] = React.useState<ProductionApplications[]>([]);

	const [deployments, setDeployments] = React.useState<Partial<Deployment>[]>([])

	const agents = useAppSelector(s => s.automation.config?.agents.production ?? [])

	const services = {
		automate: useInjection<AutomateService>(DiKeysService.core.automate)
	}

	React.useEffect(() => {
		(async () => {
			const apps = await services.automate.getProductionApps();
			setApps(apps)
		})()
	}, [services.automate])


	const sortDeployments = React.useCallback((a: typeof deployments[number], b: typeof deployments[number]) => a.agent?.uri.localeCompare(b.agent?.uri ?? "") ?? -1, [])

	const addDeployment = React.useCallback(() => {
		setDeployments([...deepClone(deployments), {}].sort(sortDeployments))
	}, [deployments, sortDeployments])


	const onAgentSelection = React.useCallback((e, index) => {
		const uri = e.target.value;
		const dep = deployments[index];
		dep.agent = agents.find(app => app.uri === uri)!
	}, [agents, deployments])

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
		deployments[index] = dep;
		setDeployments([...deployments].sort(sortDeployments))
	}, [deployments, sortDeployments])

	const size = 16

	return <div className="MappingCreateDeployment">
		<Box className={"Container"}>
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

		</Box>

	</div>
}


export default (MappingCreateDeployment)
