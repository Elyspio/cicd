using Cicd.Hub.Abstractions.Enums.Agents;

namespace Cicd.Hub.Abstractions.Transports.Agents
{
	public class AgentBuild : BaseAgent
	{
		public List<BuildAbility> Abilities { get; set; }
	}
}