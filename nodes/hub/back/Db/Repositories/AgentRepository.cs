using System.Runtime;
using Cicd.Hub.Abstractions.Extensions;
using Cicd.Hub.Abstractions.Interfaces.Repositories;
using Cicd.Hub.Abstractions.Models.Agents;
using Cicd.Hub.Abstractions.Transports;
using Cicd.Hub.Abstractions.Transports.Deploy;
using Cicd.Hub.Api.Db.Repositories.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace Cicd.Hub.Api.Db.Repositories
{
	internal class AgentRepository : IAgentRepository
	{
		private readonly IMongoCollection<BuildAgentEntity> buildCollection;
		private readonly MongoContext context;
		private readonly IMongoCollection<DeployAgentEntity> deployCollection;

		public AgentRepository(IConfiguration configuration, ILogger<AgentRepository> logger)
		{
			context = new MongoContext(configuration);

			buildCollection = context.MongoDatabase.GetCollection<BuildAgentEntity>("Agents");
			deployCollection = context.MongoDatabase.GetCollection<DeployAgentEntity>("Agents");

			var pack = new ConventionPack
			{
				new EnumRepresentationConvention(BsonType.String)
			};

			ConventionRegistry.Register("EnumStringConvention", pack, t => true);
			BsonSerializer.RegisterSerializationProvider(new EnumAsStringSerializationProvider());
		}


		public async Task<BuildAgentEntity> Add(BuildAgent agent)
		{
			var entity = new BuildAgentEntity
			{
				Availability = agent.Availability,
				Abilities = agent.Abilities,
				LastUpTime = agent.LastUpTime,
				Url = agent.Url
			};

			await buildCollection.InsertOneAsync(entity);

			return entity;
		}


		public async Task<DeployAgentEntity> Add(DeployAgent agent)
		{
			var entity = new DeployAgentEntity
			{
				Availability = agent.Availability,
				Abilities = agent.Abilities,
				Folders = agent.Folders,
				LastUpTime = agent.LastUpTime,
				Url = agent.Url
			};

			await deployCollection.InsertOneAsync(entity);

			return entity;
		}

		public async Task<DeployAgentEntity> Update(DeployAgent agent)
		{
			var updater = Builders<DeployAgentEntity>.Update.Set(a => a.Abilities, agent.Abilities)
				.Set(a => a.LastUpTime, agent.LastUpTime)
				.Set(a => a.Availability, agent.Availability)
				.Set(a => a.Folders, agent.Folders);

			var entity = await deployCollection.FindOneAndUpdateAsync(a => a.Url == agent.Url, updater);

			return entity;
		}

		public async Task<BuildAgentEntity> Update(BuildAgent agent)
		{
			var updater = Builders<BuildAgentEntity>.Update.Set(a => a.Abilities, agent.Abilities).Set(a => a.LastUpTime, agent.LastUpTime)
				.Set(a => a.Availability, agent.Availability);

			var entity = await buildCollection.FindOneAndUpdateAsync(a => a.Url == agent.Url, updater);

			return entity;
		}

		public async Task Delete<T>(string url) where T : BaseAgent
		{
			if (typeof(T) == typeof(DeployAgentEntity))
				await deployCollection.DeleteOneAsync(a => a.Url == url);
			else if (typeof(T) == typeof(BuildAgentEntity)) await buildCollection.DeleteOneAsync(a => a.Url == url);

			throw new AmbiguousImplementationException($"The type {typeof(T)} is unknown");
		}

		public async Task<List<T>> GetAll<T>() where T : BaseAgent
		{
			if (typeof(T) == typeof(DeployAgentEntity))
				return await deployCollection.AsQueryable().ToListAsync() as List<T>;
			if (typeof(T) == typeof(BuildAgentEntity)) return await buildCollection.AsQueryable().ToListAsync() as List<T>;

			throw new AmbiguousImplementationException($"The type {typeof(T)} is unknown");
		}

		public async Task<T> GetByUrl<T>(string url) where T : BaseAgent
		{
			if (typeof(T) == typeof(DeployAgentEntity)) return await deployCollection.AsQueryable().FirstOrDefaultAsync(agent => agent.Url == url) as T;

			if (typeof(T) == typeof(BuildAgentEntity)) return await buildCollection.AsQueryable().FirstOrDefaultAsync(agent => agent.Url == url) as T;

			throw new AmbiguousImplementationException($"The type {typeof(T)} is unknown");
		}

		public async Task<T> GetById<T>(Guid id) where T : BaseAgent
		{
			if (typeof(T) == typeof(DeployAgentEntity)) return await deployCollection.AsQueryable().FirstOrDefaultAsync(agent => agent.Id == id.AsObjectId()) as T;

			if (typeof(T) == typeof(BuildAgentEntity)) return await buildCollection.AsQueryable().FirstOrDefaultAsync(agent => agent.Id == id.AsObjectId()) as T;

			throw new AmbiguousImplementationException($"The type {typeof(T)} is unknown");
		}
	}
}