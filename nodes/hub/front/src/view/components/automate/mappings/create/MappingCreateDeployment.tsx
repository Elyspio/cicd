import React from "react";
import { Box, FormControl, IconButton, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import { useAppSelector } from "../../../../store";
import { deepClone } from "../../../../../core/utils/data";
import { ReactComponent as DockerIcon } from "../../icons/docker.svg";
import { Deployment } from "../../../../store/module/automation/types";
import { setSelectedDeploy } from "../../../../store/module/mapping/mapping.reducer";
import { getProductionApps } from "../../../../store/module/automation/automation.action";
import { useDispatch } from "react-redux";

function MappingCreateDeployment() {

	const [deployments, setDeployments] = React.useState<Partial<Deployment>[]>([]);

	const agents = useAppSelector((s) => s.automation.config?.agents.deploys ?? []);
	const apps = useAppSelector((s) => s.automation.productionApps ?? []);
	const dispatch = useDispatch();

	React.useEffect(() => {
		dispatch(getProductionApps());
	}, [dispatch]);

	const sortDeployments = React.useCallback((a: typeof deployments[number], b: typeof deployments[number]) => a.agent?.url.localeCompare(b.agent?.url ?? "") ?? -1, []);

	const addDeployment = React.useCallback(() => {
		setDeployments([...deepClone(deployments), {}].sort(sortDeployments));
	}, [deployments, sortDeployments]);

	const onAgentSelection = React.useCallback(
		(e, index) => {
			const url = e.target.value;
			const dep = deployments[index];
			dep.agent = agents.find((app) => app.url === url)!;
			const deps = [...deployments];
			deps.splice(index, 1);
			setDeployments([...deps, dep]);
		},
		[agents, deployments],
	);

	const onDockerComposeSelection = React.useCallback(
		(e, index) => {
			const path = e.target.value;
			const dep = deployments[index];
			dep.config = {
				url: dep.agent!.url,
				docker: {
					compose: {
						path,
					},
				},
			};
			deployments[index] = dep;
			setDeployments([...deployments].sort(sortDeployments));
		},
		[deployments, sortDeployments],
	);

	React.useEffect(() => {
		const config = deployments[0]?.config;
		if (config) {
			dispatch(
				setSelectedDeploy({
					url: config?.url,
					dockerfilePath: config?.docker?.compose?.path,
				}),
			);
		}
	}, [deployments, dispatch]);

	const size = 16;

	return (
		<div className="MappingCreateDeployment">
			<Box className={"Container"}>
				<Typography variant={"h6"}>
					Deployments
					<IconButton color={"primary"} onClick={addDeployment} size="large">
						<Add />
					</IconButton>
				</Typography>
				{deployments.map((dep, index) => (
					<div key={index}>
						<FormControl className={"FormControl"}>
							<InputLabel id={`mapping-create-image-platform-label-${index}`}>Agent</InputLabel>
							<Select
								labelId={`mapping-create-deployment-agent-label-${index}`}
								id={`mapping-create-deployment-agent-input-${index}`}
								value={dep.agent?.url ?? ""}
								label={"Agent"}
								onChange={(e) => onAgentSelection(e, index)}
								renderValue={(value) => (
									<div>
										<DockerIcon width={size} height={size} /> {value}
									</div>
								)}
								required
							>
								{apps.map((app) => (
									<MenuItem value={app.agent.url} key={app.agent.url}>
										{app.agent.url}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						{dep.agent && (
							<FormControl className={"FormControl"}>
								<InputLabel id={`mapping-create-image-platform-label-${index}`}>docker-compose.yml path</InputLabel>
								<Select
									labelId={`mapping-create-deployment-app-label-${index}`}
									id={`mapping-create-deployment-app-input-${index}`}
									label={"docker-compose.yml path"}
									value={dep.config?.docker?.compose?.path ?? ""}
									onChange={(e) => onDockerComposeSelection(e, index)}
									required
								>
									{apps
										.find((app) => dep.agent?.url === app.agent.url)
										?.apps.map((app) => (
											<MenuItem value={app} key={app}>
												{app}
											</MenuItem>
										))}
								</Select>
							</FormControl>
						)}
					</div>
				))}
			</Box>
		</div>
	);
}

export default MappingCreateDeployment;
