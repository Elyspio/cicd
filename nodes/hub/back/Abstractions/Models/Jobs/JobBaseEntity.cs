using Cicd.Hub.Abstractions.Transports.Jobs;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Cicd.Hub.Abstractions.Models.Jobs
{
	public abstract class JobBaseEntity : JobBaseRaw
	{
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public ObjectId Id { get; set; }
	}
}