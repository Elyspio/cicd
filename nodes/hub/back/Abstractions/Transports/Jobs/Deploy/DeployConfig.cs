using System.ComponentModel.DataAnnotations;

namespace Cicd.Hub.Abstractions.Transports.Jobs.Deploy
{
	public class DeployConfig
	{
		[Required] public string Url { get; set; } = null!;

		[Required] public DeployDockerConfig Docker { get; set; } = null!;
	}
}