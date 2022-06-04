using Cicd.Hub.Abstractions.Enums.Agents;

namespace Cicd.Hub.Abstractions.Transports.Agents
{
	public class AgentRaw
	{
		public AgentAvailability Availability { get; set; }
		public DateTime LastUpTime { get; set; }
		public string Url { get; set; }
	}
}