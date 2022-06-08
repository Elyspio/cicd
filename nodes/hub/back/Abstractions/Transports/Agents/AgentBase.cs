using System.ComponentModel.DataAnnotations;

namespace Cicd.Hub.Abstractions.Transports.Agents
{
	public class AgentBase : AgentRaw
	{
		[Required] public Guid Id { get; set; }
	}
}