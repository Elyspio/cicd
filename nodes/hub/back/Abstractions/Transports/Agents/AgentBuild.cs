using Cicd.Hub.Abstractions.Enums.Agents;

namespace Cicd.Hub.Abstractions.Transports.Agents
{
	public class AgentBuild : AgentBase
	{
		public List<BuildAbility> Abilities { get; set; } = null!;
	}
}