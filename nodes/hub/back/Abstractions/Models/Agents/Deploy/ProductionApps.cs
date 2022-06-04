using Cicd.Hub.Abstractions.Transports.Agents.Deploy;

namespace Cicd.Hub.Abstractions.Models.Agents.Deploy
{
	public class ProductionApps
	{
		public AgentDeploy Agent { get; set; } = null!;

		public List<string> Apps { get; set; } = null!;
	}
}