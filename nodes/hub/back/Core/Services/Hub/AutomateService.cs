using System.ComponentModel.DataAnnotations;
using Cicd.Hub.Abstractions.Common.Extensions;
using Cicd.Hub.Abstractions.Common.Helpers;
using Cicd.Hub.Abstractions.Interfaces.Repositories;
using Cicd.Hub.Abstractions.Interfaces.Services;
using Cicd.Hub.Abstractions.Interfaces.Watchers;
using Cicd.Hub.Abstractions.Transports.Agents;
using Cicd.Hub.Abstractions.Transports.Agents.Deploy;
using Cicd.Hub.Abstractions.Transports.Jobs.Build;
using Cicd.Hub.Abstractions.Transports.Jobs.Deploy;
using Cicd.Hub.Adapters.AgentBuildApi;
using Cicd.Hub.Adapters.AgentDeployApi;
using Cicd.Hub.Core.Assemblers;
using Microsoft.Extensions.Logging;
using AuthenticationApp = Cicd.Hub.Adapters.AgentDeployApi.AuthenticationApp;

namespace Cicd.Hub.Core.Services.Hub
{
	public class AutomateService : IAutomateService
	{
		private readonly IAuthenticationService authenticationService;
		private readonly BuildBakeAssembler buildBakeAssembler = new();
		private readonly DeployConfigAssembler deployConfigAssembler = new();
		private readonly GithubConfigAssembler githubConfigAssembler = new();
		private readonly JobAssembler.Build jobBuildAssembler = new();
		private readonly JobAssembler.Deploy jobDeployAssembler = new();
		private readonly IJobRepository jobRepository;
		private readonly IJobService jobService;
		private readonly ILogger<AutomateService> logger;

		public AutomateService(ILogger<AutomateService> logger, IJobRepository jobRepository, IAuthenticationService authenticationService, IDatabaseWatcher databaseWatcher, IJobService jobService)
		{
			this.logger = logger;
			this.jobRepository = jobRepository;
			this.authenticationService = authenticationService;
			this.jobService = jobService;
			databaseWatcher.WatchChanges();
		}


		public async Task<JobBuild> AskBuild(BuildConfig config, string userToken, Guid run)
		{
			logger.Enter($"{config.Github.Remote} {config.Github.Branch}");
			var appToken = await authenticationService.GetPermanentToken(userToken);
			var data = await jobService.Add(config, appToken, run);
			logger.Exit($"{config.Github.Remote} {config.Github.Branch}");
			return data;
		}

		public async Task<JobDeploy> AskDeploy(DeployConfig config, string userToken, Guid run)
		{
			logger.Enter($"{config.Url} {config.Docker.Compose.Path}");
			var appToken = await authenticationService.GetPermanentToken(userToken);
			var data = await jobService.Add(config, appToken, run);
			logger.Exit($"{config.Url} {config.Docker.Compose.Path}");
			return data;
		}

		public async Task Build(AgentBuild agent, JobBuild job)
		{
			logger.Enter($"{LogHelper.Get(agent.Id)} {LogHelper.Get(job.Id)}");

			job.StartedAt = DateTime.Now;
			await jobRepository.Update(job);

			var dockerfiles = job.Config.Dockerfile != null
				? new DockerfilesConfigModel
				{
					Platforms = job.Config.Dockerfile.Platforms,
					Files = job.Config.Dockerfile.Files.Select(df => new DockerFileConfigModel
							{
								Image = df.Image,
								Path = df.Path,
								Tag = df.Tag,
								Wd = df.WorkingDirectory
							}
						)
						.ToList(),
					Username = job.Config.Dockerfile.Username
				}
				: null;


			using var client = new HttpClient();
			var buildApi = new BuildAgentApi(agent.Url, client);
			var stds = await buildApi.BuildAsync(Adapters.AgentBuildApi.AuthenticationApp.CICD, new BuildConfigModel
				{
					Config = new()
					{
						Dockerfiles = dockerfiles,
						Github = githubConfigAssembler.Convert(job.Config.Github),
						Bake = job.Config.Bake != null ? buildBakeAssembler.Convert(job.Config.Bake) : null
					},
					Id = job.Id.ToString()
				}, job.Token
			);
			job.FinishedAt = DateTime.Now;

			var stdout = "";
			var stderr = "";
			stds.ForEach((std, i) => {
					var currentDockerFile = dockerfiles?.Files.ToList()[i];
					var header = "";
					if (currentDockerFile != null)
					{
						header = $"### {currentDockerFile.Image}:{currentDockerFile.Tag ?? "latest"} at {currentDockerFile.Wd}{currentDockerFile.Path} ###\n";
					}

					if (std.Status == 0)
					{
						stdout += header;
						stdout += std.Stderr;
					}
					else
					{
						stderr += header;
						stderr += std.Stderr;
					}
				}
			);
			job.Stderr = stderr;
			job.Stdout = stdout;


			await jobRepository.Update(job);

			jobService.SetJobCompleted(job.Id);

			logger.Exit($"{LogHelper.Get(agent.Id)} {LogHelper.Get(job.Id)}");
		}

		public async Task Deploy(AgentDeploy agent, JobDeploy job)
		{
			logger.Enter($"{LogHelper.Get(agent.Id)} {LogHelper.Get(job.Id)}");
			job.StartedAt = DateTime.Now;
			await jobRepository.Update(job);
			using var client = new HttpClient();
			var api = new DeployAgentApi(agent.Url, client);

			var stds = await api.DeployAsync(AuthenticationApp.CICD, new DeployJobModel
				{
					Config = deployConfigAssembler.Convert(job.Config),
					Id = job.Id.ToString()
				}, job.Token
			);
			job.FinishedAt = DateTime.Now;

			var stdout = "";
			var stderr = "";
			stds.ForEach((std, i) => {
					var currentDockerFile = job.Config.Docker.Compose.Path;
					var header = $"### {currentDockerFile} ###\n";
					if (std.Status == 0)
					{
						stdout += header;
						stdout += std.Stderr;
					}
					else
					{
						stderr += header;
						stderr += std.Stderr;
					}
				}
			);
			job.Stderr = stderr;
			job.Stdout = stdout;
			await jobRepository.Update(job);

			jobService.SetJobCompleted(job.Id);

			logger.Exit($"{LogHelper.Get(agent.Id)} {LogHelper.Get(job.Id)}");
		}
	}
}