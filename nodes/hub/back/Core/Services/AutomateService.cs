using Cicd.Hub.Abstractions.Extensions;
using Cicd.Hub.Abstractions.Interfaces.Repositories;
using Cicd.Hub.Abstractions.Interfaces.Services;
using Cicd.Hub.Abstractions.Transports.Agents;
using Cicd.Hub.Abstractions.Transports.Agents.Deploy;
using Cicd.Hub.Abstractions.Transports.Jobs.Build;
using Cicd.Hub.Abstractions.Transports.Jobs.Deploy;
using Cicd.Hub.Adapters.AgentBuildApi;
using Cicd.Hub.Adapters.AgentDeployApi;
using Cicd.Hub.Core.Assemblers;
using Microsoft.Extensions.Logging;

namespace Cicd.Hub.Core.Services
{
	public class AutomateService : IAutomateService
	{
		private readonly IAgentRepository agentRepository;
		private readonly IAuthenticationService authenticationService;
		private readonly BuildBakeAssembler buildBakeAssembler = new();
		private readonly DeployConfigAssembler deployConfigAssembler = new();
		private readonly GithubConfigAssembler githubConfigAssembler = new();
		private readonly IJobRepository jobRepository;
		private readonly ILogger<AutomateService> logger;

		public AutomateService(ILogger<AutomateService> logger, IAgentRepository agentRepository, IJobRepository jobRepository, IAuthenticationService authenticationService)
		{
			this.agentRepository = agentRepository;
			this.logger = logger;
			this.jobRepository = jobRepository;
			this.authenticationService = authenticationService;
		}


		public async Task AskBuild(BuildConfig config, string userToken)
		{
			var appToken = await authenticationService.GetPermanentToken(userToken);
			await jobRepository.Add(config, appToken);
		}

		public async Task AskDeploy(DeployConfig config, string userToken)
		{
			var appToken = await authenticationService.GetPermanentToken(userToken);
			await jobRepository.Add(config, appToken);
		}

		public async Task Build(AgentBuild agent, JobBuild job)
		{
			var platforms = new List<Platforms>();
			foreach (var value in Enum.GetValues<Platforms>())
				job.Config.Dockerfile?.Plateforms.ForEach(platform => {
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
			stds.ForEach(((std, i) => {
					var currentDockerFile = dockerfiles?.Files.ToList()[i];
					if (currentDockerFile != null)
					{
						var header = $"### {currentDockerFile.Image}:{currentDockerFile.Tag ?? "latest"} at {currentDockerFile.Wd}/{currentDockerFile.Path} ###\n";
						stdout += header;
						stderr += header;
					}

					stdout += std.Stdout;
					stderr += std.Stderr;
				})
			);
			job.Stderr = stderr;
			job.Stdout = stdout;
			await jobRepository.Update(job);
		}

		public async Task Deploy(AgentDeploy agent, JobDeploy job)
		{
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
			stds.ForEach(((std, i) => {
					var currentDockerFile = job.Config.Docker.Compose.Path;
					var header = $"### {currentDockerFile} ###\n";
					stdout += header;
					stderr += header;
					stdout += std.Stdout;
					stderr += std.Stderr;
				})
			);
			job.Stderr = stderr;
			job.Stdout = stdout;
			await jobRepository.Update(job);
		}
	}
}