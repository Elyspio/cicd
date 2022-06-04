using System.Runtime;
using Cicd.Hub.Abstractions.Common.Extensions;
using Cicd.Hub.Abstractions.Interfaces.Repositories;
using Cicd.Hub.Abstractions.Interfaces.Services;
using Cicd.Hub.Abstractions.Models.Jobs;
using Cicd.Hub.Abstractions.Transports.Jobs;
using Cicd.Hub.Abstractions.Transports.Jobs.Build;
using Cicd.Hub.Abstractions.Transports.Jobs.Deploy;
using Cicd.Hub.Core.Assemblers;

namespace Cicd.Hub.Core.Services
{
	public class JobService : IJobService
	{
		private readonly JobAssembler.Build jobBuildAssembler = new();
		private readonly JobAssembler.Deploy jobDeployAssembler = new();
		private readonly IJobRepository jobRepository;
		private readonly Dictionary<Guid, bool> runningJobs = new();

		public JobService(IJobRepository jobRepository)
		{
			this.jobRepository = jobRepository;
			RetrieveRunningJobs().GetAwaiter().GetResult();
		}


		public async Task<JobBuild> Add(BuildConfig config, string token)
		{
			return jobBuildAssembler.Convert(await jobRepository.Add(config, token));
		}

		public async Task<JobDeploy> Add(DeployConfig config, string token)
		{
			return jobDeployAssembler.Convert(await jobRepository.Add(config, token));
		}

		public async Task<JobBuild> Update(JobBuild job)
		{
			return jobBuildAssembler.Convert(await jobRepository.Update(job));
		}

		public async Task<JobDeploy> Update(JobDeploy job)
		{
			return jobDeployAssembler.Convert(await jobRepository.Update(job));
		}

		public async Task Delete(Guid id)
		{
			await jobRepository.Delete(id);
		}

		public async Task<List<T>> GetAll<T>() where T : JobBase
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

		public async Task<T> GetById<T>(Guid id) where T : JobBase
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

		public async Task WaitForJob(Guid id)
		{
			while (runningJobs[id] != true) await Task.Delay(100);
		}


		private async Task RetrieveRunningJobs()
		{
			var jobsBuild = await jobRepository.GetAll<JobBuildEntity>();
			foreach (var job in jobsBuild) runningJobs[job.Id.AsGuid()] = job.FinishedAt != null;
			var jobsDeploy = await jobRepository.GetAll<JobDeployEntity>();
			foreach (var job in jobsDeploy) runningJobs[job.Id.AsGuid()] = job.FinishedAt != null;
		}
	}
}