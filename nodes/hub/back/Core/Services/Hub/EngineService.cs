using Cicd.Hub.Abstractions.Common.Helpers;
using Cicd.Hub.Abstractions.Enums.Agents;
using Cicd.Hub.Abstractions.Interfaces.Services;
using Cicd.Hub.Abstractions.Transports.Agents;
using Cicd.Hub.Abstractions.Transports.Agents.Deploy;
using Cicd.Hub.Abstractions.Transports.Jobs.Build;
using Cicd.Hub.Abstractions.Transports.Jobs.Deploy;
using Microsoft.Extensions.Logging;

namespace Cicd.Hub.Core.Services.Hub
{
	public class EngineService : IEngineService
	{
		private readonly IAgentService agentService;
		private readonly IAutomateService automateService;
		private readonly IJobService jobService;
		private readonly ILogger<EngineService> logger;

		public EngineService(IAgentService agentService, IAutomateService automateService, IJobService jobService, ILogger<EngineService> logger)
		{
			this.agentService = agentService;
			this.automateService = automateService;
			this.jobService = jobService;
			this.logger = logger;
		}

		public async Task Watch()
		{
			var periodicTimer = new PeriodicTimer(TimeSpan.FromSeconds(10));
			while (await periodicTimer.WaitForNextTickAsync())
			{
				try
				{
					await Task.WhenAll(WatchBuild(), WatchDeploy());
				}
				catch (Exception e)
				{
					Console.WriteLine(e);
				}
			}
		}

		private async Task WatchBuild()
		{
			var buildAgents = await agentService.GetAvailable<AgentBuild>();
			var buildJobs = await jobService.GetPending<JobBuild>();

			logger.LogDebug($"{LogHelper.Get(buildJobs.Count)} {LogHelper.Get(buildAgents.Count)}");

			var jobQueue = new Queue<JobBuild>();
			buildJobs.ForEach(jobQueue.Enqueue);


			if (buildJobs.Any())
			{
				foreach (var agent in buildAgents)
				{
					if (jobQueue.TryDequeue(out var job))
					{
						await agentService.SetAvailability(agent.Id, AgentAvailability.Running);
						_ = automateService.Build(agent, job)
							.ContinueWith(task => {
									try
									{
										if (task.IsFaulted && task.Exception != null)
										{
											throw task.Exception;
										}
									}
									finally
									{
										agentService.SetAvailability(agent.Id, AgentAvailability.Free);
									}
								}
							);
					}
					else
					{
						break;
					}
				}
			}
		}


		private async Task WatchDeploy()
		{
			var deployAgents = await agentService.GetAvailable<AgentDeploy>();
			var deployJobs = await jobService.GetPending<JobDeploy>();

			logger.LogDebug($"{LogHelper.Get(deployAgents.Count)} {LogHelper.Get(deployJobs.Count)}");

			var jobQueue = new Queue<JobDeploy>();
			deployJobs.ForEach(jobQueue.Enqueue);

			if (deployJobs.Any())
			{
				foreach (var agent in deployAgents)
				{
					if (jobQueue.TryDequeue(out var job))
					{
						await agentService.SetAvailability(agent.Id, AgentAvailability.Running);
						_ = automateService.Deploy(agent, job)
							.ContinueWith(task => {
									try
									{
										if (task.IsFaulted && task.Exception != null)
										{
											logger.LogError(task.Exception, "Error during deployment job");
											throw task.Exception;
										}
									}
									finally
									{
										agentService.SetAvailability(agent.Id, AgentAvailability.Free);
									}
								}
							);
					}
					else
					{
						break;
					}
				}
			}
		}
	}
}