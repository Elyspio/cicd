using Cicd.Hub.Abstractions.Models.Agents;
using Cicd.Hub.Abstractions.Transports;
using Cicd.Hub.Abstractions.Transports.Deploy;

namespace Cicd.Hub.Abstractions.Interfaces.Repositories
{
	public interface IAgentRepository
	{
		Task<BuildAgentEntity> Add(BuildAgent agent);
		Task<DeployAgentEntity> Add(DeployAgent agent);
		Task<DeployAgentEntity> Update(DeployAgent agent);
		Task<BuildAgentEntity> Update(BuildAgent agent);
		Task Delete<T>(string url) where T : BaseAgent;
		Task<List<T>> GetAll<T>() where T : BaseAgent;
		Task<T> GetByUrl<T>(string url) where T : BaseAgent;
		Task<T> GetById<T>(Guid id) where T : BaseAgent;
	}
}