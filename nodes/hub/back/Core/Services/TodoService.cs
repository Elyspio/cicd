using Cicd.Hub.Abstractions.Enums.Agents;
using Cicd.Hub.Abstractions.Interfaces.Repositories;
using Cicd.Hub.Abstractions.Interfaces.Services;
using Cicd.Hub.Abstractions.Transports;
using Microsoft.Extensions.Logging;

namespace Cicd.Hub.Api.Core.Services
{
	public class TodoService : ITodoService
	{
		private readonly IAgentRepository agentRepository;
		private readonly ILogger<TodoService> logger;

		public TodoService(IAgentRepository agentRepository, ILogger<TodoService> logger)
		{
			this.agentRepository = agentRepository;
			this.logger = logger;
		}


		public async Task Test()
		{
			await agentRepository.Add(new BuildAgent
			{
				Url = "http://localhost:4012",
				Abilities = new List<BuildAbility> {BuildAbility.Docker, BuildAbility.DockerBuildx},
				Availability = AgentAvailability.Down,
				LastUpTime = DateTime.Now
			});
		}
	}
}