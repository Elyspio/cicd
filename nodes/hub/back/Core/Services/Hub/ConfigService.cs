using Cicd.Hub.Abstractions.Common.Helpers;
using Cicd.Hub.Abstractions.Interfaces.Services;
using Cicd.Hub.Abstractions.Transports.Agents;
using Cicd.Hub.Abstractions.Transports.Agents.Deploy;
using Cicd.Hub.Abstractions.Transports.Config;
using Cicd.Hub.Abstractions.Transports.Jobs.Build;
using Cicd.Hub.Abstractions.Transports.Jobs.Deploy;
using Microsoft.Extensions.Logging;

namespace Cicd.Hub.Core.Services.Hub
{
	public class ConfigService : IConfigService
	{
		private readonly IAgentService agentService;
		private readonly IJobService jobService;
		private readonly ILogger<ConfigService> logger;
		private readonly IMappingService mappingService;

		public ConfigService(IAgentService agentService, IJobService jobService, IMappingService mappingService, ILogger<ConfigService> logger)
		{
			this.agentService = agentService;
			this.jobService = jobService;
			this.mappingService = mappingService;
			this.logger = logger;
		}


		public event EventHandler<HubConfigEventArgs> OnUpdate;

		public async Task Update()
		{
			OnUpdate?.Invoke(this, new HubConfigEventArgs
				{
					Config = await Get()
				}
			);
		}

		public async Task<HubConfig> Get()
		{
			logger.Enter();

			var agentsBuild = agentService.GetAll<AgentBuild>();
			var agentsDeploy = agentService.GetAll<AgentDeploy>();

			var jobsBuild = jobService.GetAll<JobBuild>();
			var jobsDeploy = jobService.GetAll<JobDeploy>();


			var queuesBuild = jobService.GetPending<JobBuild>();
			var queuesDeploy = jobService.GetPending<JobDeploy>();

			var mappings = mappingService.GetAll();


			await Task.WhenAll(agentsBuild, agentsDeploy, jobsBuild, jobsDeploy, queuesBuild, queuesDeploy, mappings);

			logger.Exit();

			return new HubConfig
			{
				Agents = new HubConfigAgents {Builds = agentsBuild.Result, Deploys = agentsDeploy.Result},
				Jobs = new HubConfigJobs {Builds = jobsBuild.Result, Deploys = jobsDeploy.Result},
				Queues = new HubConfigJobs {Builds = queuesBuild.Result, Deploys = queuesDeploy.Result},
				Mappings = mappings.Result
			};
		}
	}
}