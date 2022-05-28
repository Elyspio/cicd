using Cicd.Hub.Abstractions.Transports.Jobs.Build;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Cicd.Hub.Abstractions.Models.Jobs
{
	public class JobBuildEntity : JobBuild
	{
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public new ObjectId Id { get; init; }
	}
}