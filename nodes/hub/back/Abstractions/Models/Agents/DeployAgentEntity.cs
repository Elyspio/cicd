using Cicd.Hub.Abstractions.Transports.Deploy;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Cicd.Hub.Abstractions.Models.Agents
{
	public class DeployAgentEntity : DeployAgent
	{
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public ObjectId Id { get; init; }
	}
}