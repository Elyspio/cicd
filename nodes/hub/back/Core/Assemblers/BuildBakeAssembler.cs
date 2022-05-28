using Cicd.Hub.Abstractions.Assemblers;
using Cicd.Hub.Abstractions.Transports.Jobs.Build;
using Cicd.Hub.Adapters.AgentBuildApi;

namespace Cicd.Hub.Core.Assemblers
{
	public class BuildBakeAssembler : BaseAssembler<BuildBakeConfig, DockerBakeModel>
	{
		public override DockerBakeModel Convert(BuildBakeConfig obj)
		{
			return new DockerBakeModel
			{
				BakeFilePath = obj.BakeFilePath
			};
		}

		public override BuildBakeConfig Convert(DockerBakeModel obj)
		{
			return new BuildBakeConfig
			{
				BakeFilePath = obj.BakeFilePath
			};
		}
	}
}