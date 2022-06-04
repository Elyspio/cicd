using Cicd.Hub.Abstractions.Enums.Agents;

namespace Cicd.Hub.Abstractions.Models.Agents
{
	public sealed class AgentBuildEntity : AgentBaseEntity
	{
		public List<BuildAbility> Abilities { get; set; } = null!;
	}
}