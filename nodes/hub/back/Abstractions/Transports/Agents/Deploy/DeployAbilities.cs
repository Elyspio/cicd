﻿using Cicd.Hub.Abstractions.Enums.Agents;

namespace Cicd.Hub.Abstractions.Transports.Agents.Deploy
{
	public class DeployAbilities
	{
		public DeployAbilityType Type { get; set; }

		public DeployDockerComposeAbility? DockerCompose { get; set; }
	}
}