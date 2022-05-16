namespace Cicd.Hub.Abstractions.Transports.Deploy
{
	public class DeployAgent : BaseAgent
	{
		public DeployAgentFolders Folders { get; set; }

		public DeployAbilities Abilities { get; set; }
	}
}