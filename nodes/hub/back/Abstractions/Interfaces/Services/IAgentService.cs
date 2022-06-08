using Cicd.Hub.Abstractions.Enums.Agents;
using Cicd.Hub.Abstractions.Models.Agents.Deploy;
using Cicd.Hub.Abstractions.Transports.Agents;
using Cicd.Hub.Abstractions.Transports.Agents.Deploy;

namespace Cicd.Hub.Abstractions.Interfaces.Services
{
	public interface IAgentService
	{
		Task<List<ProductionApps>> GetProductionApps(string token);

		Task<List<T>> GetAll<T>() where T : AgentBase;
		Task<List<T>> GetAvailable<T>() where T : AgentBase;

		Task Add(string url, List<BuildAbility> abilities);
		Task Add(string url, List<DeployAbility> abilities, DeployAgentFolders folders);

		Task Delete(string url);
		Task SetAvailability(Guid agentId, AgentAvailability availability);
	}
}