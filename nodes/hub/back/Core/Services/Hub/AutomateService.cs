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


		public async Task<JobBuild> AskBuild(BuildConfig config, string userToken)
		{
			logger.Enter($"{config.Github.Remote} {config.Github.Branch}");
			var appToken = await authenticationService.GetPermanentToken(userToken);
			var data = await jobService.Add(config, appToken);
			logger.Exit($"{config.Github.Remote} {config.Github.Branch}");
			return data;
		}

		public async Task<JobDeploy> AskDeploy(DeployConfig config, string userToken)
		{
			logger.Enter($"{config.Url} {config.Docker.Compose.Path}");
			var appToken = await authenticationService.GetPermanentToken(userToken);
			var data = await jobService.Add(config, appToken);
			logger.Exit($"{config.Url} {config.Docker.Compose.Path}");
			return data;
		}

		public async Task Build(AgentBuild agent, JobBuild job)
		{
			logger.Enter($"{LogHelper.Get(agent.Id)} {LogHelper.Get(job.Id)}");
			var platforms = new List<Platforms>();
			foreach (var value in Enum.GetValues<Platforms>())
				job.Config.Dockerfile?.Platforms.ForEach(platform => {
						if (value.ToString() == platform) platforms.Add(value);
					}
				);

			job.StartedAt = DateTime.Now;
			await jobRepository.Update(job);

			var dockerfiles = job.Config.Dockerfile != null
				? new DockerfilesConfigModel
				{
					Platforms = platforms,
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
			var stds = await buildApi.BuildAsync(new BuildConfigModel
				{
					Config = new()
					{
						Dockerfiles = dockerfiles,
						Github = githubConfigAssembler.Convert(job.Config.Github),
						Bake = job.Config.Bake != null ? buildBakeAssembler.Convert(job.Config.Bake) : null
					},
					Id = job.Id.ToString()
				}
			);
			job.FinishedAt = DateTime.Now;

			var stdout = "";
			var stderr = "";
			stds.ForEach((std, i) => {
					var currentDockerFile = dockerfiles?.Files.ToList()[i];
					if (currentDockerFile != null)
					{
						var header = $"### {currentDockerFile.Image}:{currentDockerFile.Tag ?? "latest"} at {currentDockerFile.Wd}/{currentDockerFile.Path} ###\n";
						stdout += header;
						stderr += header;
					}

					stdout += std.Stdout;
					stderr += std.Stderr;
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

			var stds = await api.DeployAsync(new DeployJobModel
				{
					Config = deployConfigAssembler.Convert(job.Config),
					Id = job.Id.ToString()
				}
			);
			job.FinishedAt = DateTime.Now;

			var stdout = "";
			var stderr = "";
			stds.ForEach((std, i) => {
					var currentDockerFile = job.Config.Docker.Compose.Path;
					var header = $"### {currentDockerFile} ###\n";
					stdout += header;
					stderr += header;
					stdout += std.Stdout;
					stderr += std.Stderr;
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