using System.ComponentModel.DataAnnotations;
using Cicd.Hub.Abstractions.Enums.Agents;

namespace Cicd.Hub.Abstractions.Transports.Agents
{
	public class AgentRaw
	{
		[Required] public AgentAvailability Availability { get; set; }

		[Required] public DateTime LastUpTime { get; set; }

		[Required] public string Url { get; set; }
	}
}