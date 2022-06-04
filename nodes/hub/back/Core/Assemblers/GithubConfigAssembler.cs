using Cicd.Hub.Abstractions.Common.Assemblers;
using Cicd.Hub.Abstractions.Transports.Jobs.Build;
using Cicd.Hub.Adapters.AgentBuildApi;

namespace Cicd.Hub.Core.Assemblers
{
	public class GithubConfigAssembler : BaseAssembler<BuildGithubConfig, GithubConfigModel>
	{
		public override GithubConfigModel Convert(BuildGithubConfig obj)
		{
			return new()
			{
				Branch = obj.Branch,
				Commit = obj.Commit,
				Remote = obj.Remote
			};
		}

		public override BuildGithubConfig Convert(GithubConfigModel obj)
		{
			return new()
			{
				Branch = obj.Branch,
				Commit = obj.Commit,
				Remote = obj.Remote
			};
		}
	}
}