using Cicd.Hub.Abstractions.Models.Agents;
using Cicd.Hub.Abstractions.Transports.Agents;
using Cicd.Hub.Abstractions.Transports.Agents.Deploy;

namespace Cicd.Hub.Abstractions.Interfaces.Repositories
{
	public interface IAgentRepository
	{
		Task<AgentBuildEntity> Add(AgentBuild agent);
		Task<AgentDeployEntity> Add(AgentDeploy agent);
		Task<AgentDeployEntity> Update(AgentDeploy agent);
		Task<AgentBuildEntity> Update(AgentBuild agent);
		Task Delete<T>(string url) where T : BaseAgent;
		Task<List<T>> GetAll<T>() where T : BaseAgent;
		Task<T> GetByUrl<T>(string url) where T : BaseAgent;
		Task<T> GetById<T>(Guid id) where T : BaseAgent;
	}
}