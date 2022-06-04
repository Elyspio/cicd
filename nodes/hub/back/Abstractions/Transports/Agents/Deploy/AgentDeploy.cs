namespace Cicd.Hub.Abstractions.Transports.Agents.Deploy
{
	public class AgentDeploy : AgentBase
	{
		public DeployAgentFolders Folders { get; set; }

		public DeployAbilities Abilities { get; set; }
	}
}