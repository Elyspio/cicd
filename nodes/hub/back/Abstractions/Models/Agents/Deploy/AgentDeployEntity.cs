using Cicd.Hub.Abstractions.Transports.Agents.Deploy;

namespace Cicd.Hub.Abstractions.Models.Agents.Deploy
{
	public sealed class AgentDeployEntity : AgentBaseEntity
	{
		public DeployAgentFolders Folders { get; set; }

		public List<DeployAbility> Abilities { get; set; }
	}
}