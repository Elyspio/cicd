using Cicd.Hub.Abstractions.Common.Helpers;
using Cicd.Hub.Abstractions.Enums.Jobs;
using Cicd.Hub.Abstractions.Interfaces.Services;
using Cicd.Hub.Abstractions.Transports.Agents.Subscribe;
using Microsoft.AspNetCore.SignalR;

namespace Cicd.Hub.Web.Hubs
{
	public class AgentsHub : Microsoft.AspNetCore.SignalR.Hub
	{
		private static readonly Dictionary<string, string> agentsUrl = new();
		private readonly IAgentService agentService;
		private readonly IJobService jobService;

		private readonly ILogger<AgentsHub> logger;

		public AgentsHub(IJobService jobService, IAgentService agentService, ILogger<AgentsHub> logger)
		{
			this.jobService = jobService;
			this.agentService = agentService;
			this.logger = logger;
		}


		[HubMethodName("job-std")]
		public async Task OnJobStd(Guid jobId, StdType type, string std)
		{
			logger.Enter($"{LogHelper.Get(jobId)}, {LogHelper.Get(type)}");
			await jobService.AddStd(jobId, type, std);
			logger.Exit($"{LogHelper.Get(jobId)}, {LogHelper.Get(type)}");
		}


		[HubMethodName("agent-connection/build")]
		public async Task OnAgentConnection(AgentBuildSubscribe config)
		{
			logger.Enter($"builder {LogHelper.Get(config.Url)}");
			agentsUrl[Context.ConnectionId] = config.Url;
			await agentService.Add(config.Url, config.Abilities.ToList());
			logger.Exit($"builder {LogHelper.Get(config.Url)}");
		}

		[HubMethodName("agent-connection/deploy")]
		public async Task OnAgentConnection(AgentDeploySubscribe config)
		{
			logger.Enter($"deploy {LogHelper.Get(config.Url)}");
			agentsUrl[Context.ConnectionId] = config.Url;
			await agentService.Add(config.Url, config.Abilities.ToList(), config.Folders);
			logger.Exit($"deploy {LogHelper.Get(config.Url)}");
		}

		public override async Task OnDisconnectedAsync(Exception exception)
		{
			if (agentsUrl.TryGetValue(Context.ConnectionId, out var url)) await agentService.Delete(url);

			await base.OnDisconnectedAsync(exception);
		}
	}
}