using System.ComponentModel.DataAnnotations;

namespace Cicd.Hub.Abstractions.Transports.Jobs.Deploy
{
	public class DeployDockerComposeConfig
	{
		[Required] public string Path { get; set; } = null!;
	}
}