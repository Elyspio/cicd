using Cicd.Hub.Abstractions.Transports.Agents;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Cicd.Hub.Abstractions.Models.Agents
{
	public class AgentBuildEntity : AgentBuild
	{
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public ObjectId Id { get; init; }
	}
}