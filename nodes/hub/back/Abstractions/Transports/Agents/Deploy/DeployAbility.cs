using System.ComponentModel.DataAnnotations;
using Cicd.Hub.Abstractions.Enums.Agents;

namespace Cicd.Hub.Abstractions.Transports.Agents.Deploy
{
	public class DeployAbility
	{
		[Required] public DeployAbilityType Type { get; set; }

		public DeployDockerComposeAbility? DockerCompose { get; set; }
	}
}