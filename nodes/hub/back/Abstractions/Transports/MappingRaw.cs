using System.ComponentModel.DataAnnotations;
using Cicd.Hub.Abstractions.Transports.Jobs.Build;
using Cicd.Hub.Abstractions.Transports.Jobs.Deploy;

namespace Cicd.Hub.Abstractions.Transports
{
	public class MappingRaw
	{
		[Required] public BuildConfig Build { get; set; }

		[Required] public DeployConfig Deploy { get; set; }

	}
}