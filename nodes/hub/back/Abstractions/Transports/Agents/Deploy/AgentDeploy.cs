using System.ComponentModel.DataAnnotations;

namespace Cicd.Hub.Abstractions.Transports.Agents.Deploy
{
	public class AgentDeploy : AgentBase
	{
		[Required] public DeployAgentFolders Folders { get; set; }

		[Required] public List<DeployAbility> Abilities { get; set; }
	}
}