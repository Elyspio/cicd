using Cicd.Hub.Abstractions.Interfaces.Repositories;
using Cicd.Hub.Abstractions.Interfaces.Services;
using Cicd.Hub.Abstractions.Models.Agents.Deploy;
using Cicd.Hub.Adapters.AgentDeployApi;
using Cicd.Hub.Core.Assemblers;

namespace Cicd.Hub.Core.Services
{
	public class AgentService : IAgentService
	{
		private readonly AgentAssembler.Deploy agentDeployAssembler = new();
		private readonly IAgentRepository agentRepository;

		public AgentService(IAgentRepository agentRepository)
		{
			this.agentRepository = agentRepository;
		}

		public async Task<List<ProductionApps>> GetProductionApps(string token)
		{
			var deployAgents = await agentRepository.GetAll<AgentDeployEntity>();


			return (await Task.WhenAll(deployAgents.Select(async agent => {
						using var client = new HttpClient();
						var api = new AutomateApi(agent.Url, client);
						return new ProductionApps
						{
							Agent = agentDeployAssembler.Convert(agent),
							Apps = (await api.GetAppsAsync(token)).ToList()
						};
					}
				)
			)).ToList();
		}
	}
}