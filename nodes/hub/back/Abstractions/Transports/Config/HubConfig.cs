using System.ComponentModel.DataAnnotations;

namespace Cicd.Hub.Abstractions.Transports.Config
{
	public class HubConfig
	{
		[Required] public HubConfigAgents Agents { get; set; } = null!;

		[Required] public HubConfigJobs Jobs { get; set; } = null!;
		[Required] public HubConfigJobs Queues { get; set; } = null!;

		[Required] public List<Mapping> Mappings { get; set; } = null!;
	}
}