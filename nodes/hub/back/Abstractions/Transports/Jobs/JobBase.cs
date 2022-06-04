using System.ComponentModel.DataAnnotations;
using Cicd.Hub.Abstractions.Models.Jobs;
using MongoDB.Bson.Serialization.Attributes;

namespace Cicd.Hub.Abstractions.Transports.Jobs
{
	[BsonKnownTypes(typeof(JobBuildEntity), typeof(JobDeployEntity))]
	public abstract class JobBase : JobBaseRaw
	{
		[Required] public Guid Id { get; set; } = Guid.Empty;
	}
}