using Cicd.Hub.Abstractions.Transports;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Cicd.Hub.Abstractions.Models
{
	public class MappingEntity : MappingRaw
	{
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public new ObjectId Id { get; init; }
	}
}