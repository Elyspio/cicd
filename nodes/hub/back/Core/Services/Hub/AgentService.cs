using System.Runtime;
using Cicd.Hub.Abstractions.Common.Helpers;
using Cicd.Hub.Abstractions.Enums.Agents;
using Cicd.Hub.Abstractions.Interfaces.Repositories;
using Cicd.Hub.Abstractions.Interfaces.Services;
using Cicd.Hub.Abstractions.Models.Agents;
using Cicd.Hub.Abstractions.Models.Agents.Deploy;
using Cicd.Hub.Abstractions.Transports.Agents;
using Cicd.Hub.Abstractions.Transports.Agents.Deploy;
using Cicd.Hub.Adapters.AgentDeployApi;
using Cicd.Hub.Core.Assemblers;
using Microsoft.Extensions.Logging;

namespace Cicd.Hub.Core.Services.Hub
{
	public class AgentService : IAgentService
	{
		private readonly AgentAssembler.Build agentBuildAssembler = new();
		private readonly AgentAssembler.Deploy agentDeployAssembler = new();
		private readonly IAgentRepository agentRepository;
		private readonly ILogger<AgentService> logger;
		public AgentService(IAgentRepository agentRepository, ILogger<AgentService> logger)
		{
			this.agentRepository = agentRepository;
			this.logger = logger;
		}

		public async Task<List<ProductionApps>> GetProductionApps(string token)
		{
			logger.Enter(LogHelper.Get(token));
			var deployAgents = await agentRepository.GetAll<AgentDeployEntity>();


			var apps = (await Task.WhenAll(deployAgents.Select(async agent => {
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

			logger.Exit(LogHelper.Get(token));
			return apps;
		}

		public async Task<List<T>> GetAll<T>() where T : AgentBase
		{
			logger.Enter(LogHelper.Get(typeof(T).Name));
			try
			{
				if (typeof(T) == typeof(AgentBuild))
				{
					var entities = await agentRepository.GetAll<AgentBuildEntity>();
					return agentBuildAssembler.Convert(entities) as List<T> ?? new List<T>();
				}

				if (typeof(T) == typeof(AgentDeploy))
				{
					var entities = await agentRepository.GetAll<AgentDeployEntity>();
					return agentDeployAssembler.Convert(entities) as List<T> ?? new List<T>();
				}

				throw new AmbiguousImplementationException($"The type {typeof(T)} is unknown");
			}
			finally
			{
				logger.Exit(LogHelper.Get(typeof(T).Name));
			}
		}

		public async Task<List<T>> GetAvailable<T>() where T : AgentBase
		{
			logger.Enter(LogHelper.Get(typeof(T).Name));
			try
			{
				if (typeof(T) == typeof(AgentBuild))
				{
					var entities = await agentRepository.GetAvailable<AgentBuildEntity>();
					return agentBuildAssembler.Convert(entities) as List<T> ?? new List<T>();
				}

				if (typeof(T) == typeof(AgentDeploy))
				{
					var entities = await agentRepository.GetAvailable<AgentDeployEntity>();
					return agentDeployAssembler.Convert(entities) as List<T> ?? new List<T>();
				}

				throw new AmbiguousImplementationException($"The type {typeof(T)} is unknown");
			}
			finally
			{
				logger.Exit(LogHelper.Get(typeof(T).Name));
			}
		}

		public async Task Add(string url, List<BuildAbility> abilities)
		{
			logger.Enter($"build {LogHelper.Get(url)} {LogHelper.Get(abilities)}");
			await agentRepository.Add(new AgentBuild
				{
					Abilities = abilities,
					Availability = AgentAvailability.Free,
					LastUpTime = DateTime.Now,
					Url = url
				}
			);

			logger.Exit($"build {LogHelper.Get(url)} {LogHelper.Get(abilities)}");
		}

		public async Task Add(string url, List<DeployAbility> abilities, DeployAgentFolders folders)
		{
			logger.Enter($"deploy {LogHelper.Get(url)} {LogHelper.Get(abilities)} {LogHelper.Get(folders)}");
			await agentRepository.Add(new AgentDeploy
				{
					Abilities = abilities,
					Folders = folders,
					Availability = AgentAvailability.Free,
					LastUpTime = DateTime.Now,
					Url = url
				}
			);

			logger.Exit($"deploy {LogHelper.Get(url)} {LogHelper.Get(abilities)} {LogHelper.Get(folders)}");
		}

		public async Task Delete(string url)
		{
			logger.Enter(LogHelper.Get(url));
			await agentRepository.Delete(url);
			logger.Exit(LogHelper.Get(url));
		}

		public async Task SetAvailability(Guid agentId, AgentAvailability availability)
		{
			logger.Enter($"{LogHelper.Get(agentId)} {LogHelper.Get(availability)}");
			await agentRepository.SetAvailability(agentId, availability);
			logger.Exit($"{LogHelper.Get(agentId)} {LogHelper.Get(availability)}");
		}
	}
}