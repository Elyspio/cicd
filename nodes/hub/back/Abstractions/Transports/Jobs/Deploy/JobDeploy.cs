using System.ComponentModel.DataAnnotations;

namespace Cicd.Hub.Abstractions.Transports.Jobs.Deploy
{
	public class JobDeploy : JobBase
	{
		[Required] public DeployConfig Config { get; set; } = null!;
	}
}