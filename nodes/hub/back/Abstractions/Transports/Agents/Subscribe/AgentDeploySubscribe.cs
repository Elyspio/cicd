using Cicd.Hub.Abstractions.Transports.Agents.Deploy;

namespace Cicd.Hub.Abstractions.Transports.Agents.Subscribe
{
	public class AgentDeploySubscribe : AgentSubscribe
	{
		public DeployAgentFolders Folders { get; set; } = null!;
		public DeployAbility[] Abilities { get; set; } = null!;
	}
}