using System.ComponentModel.DataAnnotations;

namespace Cicd.Hub.Abstractions.Transports.Jobs.Deploy
{
	public class DeployDockerConfig
	{
		[Required] public DeployDockerComposeConfig Compose { get; set; } = null!;
	}
}