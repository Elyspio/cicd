using Cicd.Hub.Abstractions.Models.Agents.Deploy;

namespace Cicd.Hub.Abstractions.Interfaces.Services
{
	public interface IAgentService
	{
		Task<List<ProductionApps>> GetProductionApps(string token);
	}
}