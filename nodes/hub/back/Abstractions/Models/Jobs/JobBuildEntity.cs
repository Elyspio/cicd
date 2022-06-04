using Cicd.Hub.Abstractions.Transports.Jobs.Build;

namespace Cicd.Hub.Abstractions.Models.Jobs
{
	public class JobBuildEntity : JobBaseEntity
	{
		public BuildConfig Config { get; set; } = null!;
	}
}