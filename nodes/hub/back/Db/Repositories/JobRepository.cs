using System.Runtime;
using Cicd.Hub.Abstractions.Common.Extensions;
using Cicd.Hub.Abstractions.Enums.Jobs;
using Cicd.Hub.Abstractions.Interfaces.Repositories;
using Cicd.Hub.Abstractions.Models.Jobs;
using Cicd.Hub.Abstractions.Transports.Jobs.Build;
using Cicd.Hub.Abstractions.Transports.Jobs.Deploy;
using Cicd.Hub.Db.Repositories.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace Cicd.Hub.Db.Repositories
{
	internal class JobRepository : IJobRepository
	{
		private readonly IMongoCollection<JobBuildEntity> buildCollection;
		private readonly MongoContext context;
		private readonly IMongoCollection<JobDeployEntity> deployCollection;


		public JobRepository(IConfiguration configuration, ILogger<AgentRepository> logger)
		{
			context = new MongoContext(configuration);

			buildCollection = context.MongoDatabase.GetCollection<JobBuildEntity>("Jobs.Build");
			deployCollection = context.MongoDatabase.GetCollection<JobDeployEntity>("Jobs.Deploy");
		}

		public async Task<JobBuildEntity> Add(BuildConfig config, string token)
		{
			var entity = new JobBuildEntity
			{
				Config = config,
				CreatedAt = new DateTime(),
				Token = token
			};

			await buildCollection.InsertOneAsync(entity);

			return entity;
		}

		public async Task<JobDeployEntity> Add(DeployConfig config, string token)
		{
			var entity = new JobDeployEntity
			{
				Config = config,
				CreatedAt = new DateTime(),
				Token = token
			};

			await deployCollection.InsertOneAsync(entity);

			return entity;
		}

		public async Task<JobBuildEntity> Update(JobBuild job)
		{
			var updater = Builders<JobBuildEntity>.Update.Set(a => a.Config, job.Config)
				.Set(a => a.StartedAt, job.StartedAt)
				.Set(a => a.FinishedAt, job.FinishedAt)
				.Set(a => a.Stderr, job.Stderr)
				.Set(a => a.Stdout, job.Stdout);

			var entity = await buildCollection.FindOneAndUpdateAsync(a => a.Id.AsGuid() == job.Id, updater);

			return entity;
		}

		public async Task<JobDeployEntity> Update(JobDeploy job)
		{
			var updater = Builders<JobDeployEntity>.Update.Set(a => a.Config, job.Config)
				.Set(a => a.StartedAt, job.StartedAt)
				.Set(a => a.FinishedAt, job.FinishedAt)
				.Set(a => a.Stderr, job.Stderr)
				.Set(a => a.Stdout, job.Stdout);

			var entity = await deployCollection.FindOneAndUpdateAsync(a => a.Id.AsGuid() == job.Id, updater);

			return entity;
		}


		public async Task Delete(Guid id)
		{
			await Task.WhenAll(deployCollection.DeleteOneAsync(a => a.Id.AsGuid() == id), buildCollection.DeleteOneAsync(a => a.Id.AsGuid() == id));
		}

		public async Task<List<T>> GetAll<T>() where T : JobBaseEntity
		{
			if (typeof(T) == typeof(JobDeployEntity)) return await deployCollection.AsQueryable().ToListAsync() as List<T> ?? new List<T>();

			if (typeof(T) == typeof(JobBuildEntity)) return await buildCollection.AsQueryable().ToListAsync() as List<T> ?? new List<T>();

			throw new AmbiguousImplementationException($"The type {typeof(T)} is unknown");
		}

		public async Task<T?> GetById<T>(Guid id) where T : JobBaseEntity
		{
			if (typeof(T) == typeof(JobDeployEntity)) return await deployCollection.AsQueryable().FirstOrDefaultAsync(agent => agent.Id.AsGuid() == id) as T;

			if (typeof(T) == typeof(JobBuildEntity)) return await buildCollection.AsQueryable().FirstOrDefaultAsync(agent => agent.Id.AsGuid() == id) as T;

			throw new AmbiguousImplementationException($"The type {typeof(T)} is unknown");
		}

		public async Task AddStdout(Guid id, StdType type, string message)
		{
			var updater = type switch
			{
				StdType.Out => Builders<JobBaseEntity>.Update.Set(job => job.Stdout, message),
				StdType.Error => Builders<JobBaseEntity>.Update.Set(job => job.Stderr, message),
				_ => null
			};

			var buildEntity = await GetById<JobBuildEntity>(id);
			if (buildEntity != null)
			{
				switch (type)
				{
					case StdType.Out:
						buildEntity.Stdout += message;
						break;
					case StdType.Error:
						buildEntity.Stderr += message;
						break;
					default:
						throw new ArgumentOutOfRangeException(nameof(type), type, null);
				}

				await buildCollection.ReplaceOneAsync(job => job.Id.AsGuid() == id, buildEntity);
			}

			var deployEntity = await GetById<JobDeployEntity>(id);
			if (deployEntity != null)
			{
				switch (type)
				{
					case StdType.Out:
						deployEntity.Stdout += message;
						break;
					case StdType.Error:
						deployEntity.Stderr += message;
						break;
					default:
						throw new ArgumentOutOfRangeException(nameof(type), type, null);
				}

				await deployCollection.ReplaceOneAsync(job => job.Id.AsGuid() == id, deployEntity);
			}
		}

		public async Task<List<T>> GetPendingJobs<T>() where T : JobBaseEntity
		{
			if (typeof(T) == typeof(JobDeployEntity)) return await deployCollection.AsQueryable().Where(job => job.StartedAt == null).ToListAsync() as List<T> ?? new List<T>();

			if (typeof(T) == typeof(JobBuildEntity)) return await buildCollection.AsQueryable().Where(job => job.StartedAt == null).ToListAsync() as List<T> ?? new List<T>();

			throw new AmbiguousImplementationException($"The type {typeof(T)} is unknown");
		}
	}
}