using Cicd.Hub.Abstractions.Transports.Jobs.Deploy;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Cicd.Hub.Abstractions.Models.Jobs
{
	public class JobDeployEntity : JobDeploy
	{
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public new ObjectId Id { get; init; }
	}
}