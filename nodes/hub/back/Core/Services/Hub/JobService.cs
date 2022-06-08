using System.Runtime;
using Cicd.Hub.Abstractions.Common.Extensions;
using Cicd.Hub.Abstractions.Common.Helpers;
using Cicd.Hub.Abstractions.Enums.Jobs;
using Cicd.Hub.Abstractions.Interfaces.Repositories;
using Cicd.Hub.Abstractions.Interfaces.Services;
using Cicd.Hub.Abstractions.Models.Jobs;
using Cicd.Hub.Abstractions.Transports.Jobs;
using Cicd.Hub.Abstractions.Transports.Jobs.Build;
using Cicd.Hub.Abstractions.Transports.Jobs.Deploy;
using Cicd.Hub.Core.Assemblers;
using Microsoft.Extensions.Logging;

namespace Cicd.Hub.Core.Services.Hub
{
	public class JobService : IJobService
	{
		private readonly Dictionary<Guid, bool> endedJobs = new();
		private readonly JobAssembler.Build jobBuildAssembler = new();
		private readonly JobAssembler.Deploy jobDeployAssembler = new();
		private readonly IJobRepository jobRepository;
		private readonly ILogger<JobService> logger;

		public JobService(IJobRepository jobRepository, ILogger<JobService> logger)
		{
			this.jobRepository = jobRepository;
			this.logger = logger;
			RetrieveRunningJobs().GetAwaiter().GetResult();
		}


		public async Task<JobBuild> Add(BuildConfig config, string token)
		{
			logger.Enter($"build {LogHelper.Get(config.Github.Branch)} {LogHelper.Get(token)}");
			var data = jobBuildAssembler.Convert(await jobRepository.Add(config, token));
			endedJobs[data.Id] = false;
			logger.Exit($"build {LogHelper.Get(config.Github.Branch)} {LogHelper.Get(token)}");
			return data;
		}

		public async Task<JobDeploy> Add(DeployConfig config, string token)
		{
			logger.Enter($"deploy {LogHelper.Get(config.Url)} {LogHelper.Get(token)}");
			var data = jobDeployAssembler.Convert(await jobRepository.Add(config, token));
			endedJobs[data.Id] = false;
			logger.Exit($"deploy {LogHelper.Get(config.Url)} {LogHelper.Get(token)}");
			return data;
		}

		public async Task<JobBuild> Update(JobBuild job)
		{
			logger.Enter($"build {LogHelper.Get(job.Id)}");
			var data = jobBuildAssembler.Convert(await jobRepository.Update(job));
			logger.Exit($"build {LogHelper.Get(job.Id)}");
			return data;
		}

		public async Task<JobDeploy> Update(JobDeploy job)
		{
			logger.Enter($"deploy {LogHelper.Get(job.Id)}");
			var data = jobDeployAssembler.Convert(await jobRepository.Update(job));
			logger.Exit($"deploy {LogHelper.Get(job.Id)}");
			return data;
		}

		public async Task Delete(Guid id)
		{
			logger.Enter($"{LogHelper.Get(id)}");
			await jobRepository.Delete(id);
			logger.Exit($"{LogHelper.Get(id)}");
		}

		public async Task<List<T>> GetAll<T>() where T : JobBase
		{
			logger.Enter($"{LogHelper.Get(typeof(T).Name)}");
			try
			{
				if (typeof(T) == typeof(JobBuild))
				{
					var entities = await jobRepository.GetAll<JobBuildEntity>();
					return jobBuildAssembler.Convert(entities) as List<T> ?? new List<T>();
				}

				if (typeof(T) == typeof(JobDeploy))
				{
					var entities = await jobRepository.GetAll<JobDeployEntity>();
					return jobDeployAssembler.Convert(entities) as List<T> ?? new List<T>();
				}

				throw new AmbiguousImplementationException($"The type {typeof(T)} is unknown");
			}
			finally
			{
				logger.Exit($"{LogHelper.Get(typeof(T).Name)}");
			}
		}

		public async Task<List<T>> GetPending<T>() where T : JobBase
		{
			logger.Enter($"{LogHelper.Get(typeof(T).Name)}");
			try
			{
				if (typeof(T) == typeof(JobBuild))
				{
					var entities = await jobRepository.GetPendingJobs<JobBuildEntity>();
					return jobBuildAssembler.Convert(entities) as List<T> ?? new List<T>();
				}

				if (typeof(T) == typeof(JobDeploy))
				{
					var entities = await jobRepository.GetPendingJobs<JobDeployEntity>();
					return jobDeployAssembler.Convert(entities) as List<T> ?? new List<T>();
				}

				throw new AmbiguousImplementationException($"The type {typeof(T)} is unknown");
			}
			finally
			{
				logger.Exit($"{LogHelper.Get(typeof(T).Name)}");
			}
		}


		public async Task<T> GetById<T>(Guid id) where T : JobBase
		{
			logger.Enter($"{LogHelper.Get(typeof(T).Name)}");
			try
			{
				if (typeof(T) == typeof(JobBuild))
				{
					var entities = await jobRepository.GetById<JobBuildEntity>(id);
					return (jobBuildAssembler.Convert(entities) as T)!;
				}

				if (typeof(T) == typeof(JobDeploy))
				{
					var entities = await jobRepository.GetById<JobDeployEntity>(id);
					return (jobDeployAssembler.Convert(entities) as T)!;
				}

				throw new AmbiguousImplementationException($"The type {typeof(T)} is unknown");
			}
			finally
			{
				logger.Exit($"{LogHelper.Get(typeof(T).Name)}");
			}
		}

		public async Task WaitForJob(Guid id)
		{
			logger.Enter($"{LogHelper.Get(id)}");
			while (endedJobs[id] != true)
			{
				await Task.Delay(100);
			}
			logger.Exit($"{LogHelper.Get(id)}");
		}

		public async Task AddStd(Guid id, StdType type, string std)
		{
			logger.Enter($"{LogHelper.Get(id)} {LogHelper.Get(type)}");
			await jobRepository.AddStdout(id, type, std);
			logger.Exit($"{LogHelper.Get(id)} {LogHelper.Get(type)}");
		}


		private async Task RetrieveRunningJobs()
		{
			logger.Enter();
			var jobsBuild = await jobRepository.GetAll<JobBuildEntity>();
			foreach (var job in jobsBuild) endedJobs[job.Id.AsGuid()] = job.FinishedAt != null;
			var jobsDeploy = await jobRepository.GetAll<JobDeployEntity>();
			foreach (var job in jobsDeploy) endedJobs[job.Id.AsGuid()] = job.FinishedAt != null;
			logger.Exit();
		}

		public void SetJobCompleted(Guid id)
		{
			logger.Enter($"{LogHelper.Get(id)}");
			endedJobs[id] = true;
			logger.Exit($"{LogHelper.Get(id)}");
		}
	}
}