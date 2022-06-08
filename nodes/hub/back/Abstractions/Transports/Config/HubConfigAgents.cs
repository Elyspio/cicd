using System.ComponentModel.DataAnnotations;
using Cicd.Hub.Abstractions.Transports.Agents;
using Cicd.Hub.Abstractions.Transports.Agents.Deploy;

namespace Cicd.Hub.Abstractions.Transports.Config
{
	public class HubConfigAgents
	{
		[Required] public List<AgentBuild> Builds { get; set; } = null!;

		[Required] public List<AgentDeploy> Deploys { get; set; } = null!;
	}
}