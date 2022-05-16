using Cicd.Hub.Abstractions.Enums.Agents;

namespace Cicd.Hub.Abstractions.Transports
{
	public class BuildAgent : BaseAgent
	{
		public List<BuildAbility> Abilities { get; set; }
	}
}