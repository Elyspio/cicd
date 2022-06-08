using System.ComponentModel.DataAnnotations;

namespace Cicd.Hub.Abstractions.Transports.Agents.Deploy
{
	public class DeployDockerComposeAbility
	{
		[Required] public bool IntegratedToCLi { get; set; }
	}
}