using System.ComponentModel.DataAnnotations;
using Cicd.Hub.Abstractions.Enums.Agents;

namespace Cicd.Hub.Abstractions.Transports.Agents
{
	public class AgentBuild : AgentBase
	{
		[Required] public List<BuildAbility> Abilities { get; set; } = null!;
	}
}