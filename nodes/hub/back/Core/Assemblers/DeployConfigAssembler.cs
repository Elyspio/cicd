using Cicd.Hub.Abstractions.Common.Assemblers;
using Cicd.Hub.Abstractions.Transports.Jobs.Deploy;
using Cicd.Hub.Adapters.AgentDeployApi;

namespace Cicd.Hub.Core.Assemblers
{
	public class DeployConfigAssembler : BaseAssembler<DeployConfigModel, DeployConfig>
	{
		public override DeployConfig Convert(DeployConfigModel obj)
		{
			return new()
			{
				Docker = new()
				{
					Compose = new()
					{
						Path = obj.Docker.Compose?.Path!
					}
				},
				Url = obj.Uri
			};
		}

		public override DeployConfigModel Convert(DeployConfig obj)
		{
			return new DeployConfigModel
			{
				Docker = new()
				{
					Compose = new()
					{
						Path = obj.Docker.Compose?.Path!
					}
				},
				Uri = obj.Url
			};
		}
	}
}