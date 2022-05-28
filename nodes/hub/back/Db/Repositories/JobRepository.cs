using System.Runtime;
using Cicd.Hub.Abstractions.Extensions;
using Cicd.Hub.Abstractions.Interfaces.Repositories;
using Cicd.Hub.Abstractions.Models.Agents;
using Cicd.Hub.Abstractions.Models.Jobs;
using Cicd.Hub.Abstractions.Transports.Jobs;
using Cicd.Hub.Abstractions.Transports.Jobs.Build;
using Cicd.Hub.Abstractions.Transports.Jobs.Deploy;
using Cicd.Hub.Db.Repositories.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
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

			buildCollection = context.MongoDatabase.GetCollection<JobBuildEntity>("Jobs");
			deployCollection = context.MongoDatabase.GetCollection<JobDeployEntity>("Jobs");

			var pack = new ConventionPack
			{
				new EnumRepresentationConvention(BsonType.String)
			};

			ConventionRegistry.Register("EnumStringConvention", pack, t => true);
			BsonSerializer.RegisterSerializationProvider(new EnumAsStringSerializationProvider());
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

		public async Task Delete<T>(Guid id) where T : JobBase
		{
			if (typeof(T) == typeof(AgentDeployEntity))
				await deployCollection.DeleteOneAsync(a => a.Id.AsGuid() == id);
			else if (typeof(T) == typeof(AgentBuildEntity)) await buildCollection.DeleteOneAsync(a => a.Id.AsGuid() == id);

			throw new AmbiguousImplementationException($"The type {typeof(T)} is unknown");
		}

		public async Task<List<T>> GetAll<T>() where T : JobBase
		{
			if (typeof(T) == typeof(AgentDeployEntity)) return await deployCollection.AsQueryable().ToListAsync() as List<T>;

			if (typeof(T) == typeof(AgentBuildEntity)) return await buildCollection.AsQueryable().ToListAsync() as List<T>;

			throw new AmbiguousImplementationException($"The type {typeof(T)} is unknown");
		}

		public async Task<T> GetById<T>(Guid id) where T : JobBase
		{
			if (typeof(T) == typeof(AgentDeployEntity)) return await deployCollection.AsQueryable().FirstOrDefaultAsync(agent => agent.Id == id.AsObjectId()) as T;

			if (typeof(T) == typeof(AgentBuildEntity)) return await buildCollection.AsQueryable().FirstOrDefaultAsync(agent => agent.Id == id.AsObjectId()) as T;

			throw new AmbiguousImplementationException($"The type {typeof(T)} is unknown");
		}
	}
}