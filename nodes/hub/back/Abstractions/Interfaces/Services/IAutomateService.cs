using Cicd.Hub.Abstractions.Transports.Agents;
using Cicd.Hub.Abstractions.Transports.Agents.Deploy;
using Cicd.Hub.Abstractions.Transports.Jobs.Build;
using Cicd.Hub.Abstractions.Transports.Jobs.Deploy;

namespace Cicd.Hub.Abstractions.Interfaces.Services
{
	public interface IAutomateService
	{
		Task Build(AgentBuild agent, JobBuild job);
		Task Deploy(AgentDeploy agent, JobDeploy job);
		Task<JobBuild> AskBuild(BuildConfig config, string userToken, Guid run);
		Task<JobDeploy> AskDeploy(DeployConfig config, string userToken, Guid run);
	}
}