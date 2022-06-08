using System.ComponentModel.DataAnnotations;
using Cicd.Hub.Abstractions.Transports.Jobs.Build;
using Cicd.Hub.Abstractions.Transports.Jobs.Deploy;

namespace Cicd.Hub.Abstractions.Transports.Config
{
	public class HubConfigJobs
	{
		[Required] public List<JobBuild> Builds { get; set; } = null!;

		[Required] public List<JobDeploy> Deploys { get; set; } = null!;
	}
}