using Cicd.Hub.Abstractions.Transports.Jobs.Build;
using Cicd.Hub.Abstractions.Transports.Jobs.Deploy;

namespace Cicd.Hub.Web.Models.Requests
{
	public class AddMappingRequest
	{
		public BuildConfig Build { get; set; }
		public DeployConfig Deploy { get; set; }
	}
}