using Cicd.Hub.Abstractions.Transports.Agents;
using MongoDB.Bson;

namespace Cicd.Hub.Abstractions.Models.Agents
{
	public abstract class AgentBaseEntity : AgentRaw
	{
		public ObjectId Id { get; set; }
	}
}