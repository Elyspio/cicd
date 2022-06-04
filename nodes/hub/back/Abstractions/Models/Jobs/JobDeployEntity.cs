using Cicd.Hub.Abstractions.Transports.Jobs.Deploy;

namespace Cicd.Hub.Abstractions.Models.Jobs
{
	public class JobDeployEntity : JobBaseEntity
	{
		public DeployConfig Config { get; set; } = null!;
	}
}