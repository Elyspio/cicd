using System.ComponentModel.DataAnnotations;
using Cicd.Hub.Abstractions.Transports.Agents.Deploy;

namespace Cicd.Hub.Abstractions.Models.Agents.Deploy
{
	public class ProductionApps
	{
		[Required] public AgentDeploy Agent { get; set; } = null!;

		[Required] public List<string> Apps { get; set; } = null!;
	}
}