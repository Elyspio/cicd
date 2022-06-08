using Cicd.Hub.Abstractions.Enums.Agents;

namespace Cicd.Hub.Abstractions.Transports.Agents.Subscribe
{
	public class AgentBuildSubscribe : AgentSubscribe
	{
		public BuildAbility[] Abilities { get; set; }
	}
}