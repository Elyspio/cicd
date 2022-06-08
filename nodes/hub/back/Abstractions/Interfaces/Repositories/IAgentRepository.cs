using Cicd.Hub.Abstractions.Enums.Agents;
using Cicd.Hub.Abstractions.Models.Agents;
using Cicd.Hub.Abstractions.Models.Agents.Deploy;
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
		Task Delete(string url);
		Task<List<T>> GetAll<T>() where T : AgentBaseEntity;
		Task<List<T>> GetAvailable<T>() where T : AgentBaseEntity;
		Task<T?> GetByUrl<T>(string url) where T : AgentBaseEntity;
		Task<T?> GetById<T>(Guid id) where T : AgentBaseEntity;
		Task SetAvailability(Guid id, AgentAvailability availability);
	}
}