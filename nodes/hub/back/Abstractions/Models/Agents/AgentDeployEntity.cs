using Cicd.Hub.Abstractions.Transports.Agents.Deploy;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Cicd.Hub.Abstractions.Models.Agents
{
	public class AgentDeployEntity : AgentDeploy
	{
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public ObjectId Id { get; init; }
	}
}