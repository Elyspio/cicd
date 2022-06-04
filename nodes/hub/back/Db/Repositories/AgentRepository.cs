using System.Runtime;
using Cicd.Hub.Abstractions.Common.Extensions;
using Cicd.Hub.Abstractions.Interfaces.Repositories;
using Cicd.Hub.Abstractions.Models.Agents;
using Cicd.Hub.Abstractions.Models.Agents.Deploy;
using Cicd.Hub.Abstractions.Transports.Agents;
using Cicd.Hub.Abstractions.Transports.Agents.Deploy;
using Cicd.Hub.Db.Repositories.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace Cicd.Hub.Db.Repositories
{
	internal class AgentRepository : IAgentRepository
	{
		private readonly IMongoCollection<AgentBuildEntity> buildCollection;
		private readonly MongoContext context;
		private readonly IMongoCollection<AgentDeployEntity> deployCollection;

		public AgentRepository(IConfiguration configuration, ILogger<AgentRepository> logger)
		{
			context = new MongoContext(configuration);

			buildCollection = context.MongoDatabase.GetCollection<AgentBuildEntity>("Agents");
			deployCollection = context.MongoDatabase.GetCollection<AgentDeployEntity>("Agents");
		}


		public async Task<AgentBuildEntity> Add(AgentBuild agent)
		{
			var entity = new AgentBuildEntity
			{
				Availability = agent.Availability,
				Abilities = agent.Abilities,
				LastUpTime = agent.LastUpTime,
				Url = agent.Url
			};

			await buildCollection.InsertOneAsync(entity);

			return entity;
		}


		public async Task<AgentDeployEntity> Add(AgentDeploy agent)
		{
			var entity = new AgentDeployEntity
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

		public async Task<AgentDeployEntity> Update(AgentDeploy agent)
		{
			var updater = Builders<AgentDeployEntity>.Update.Set(a => a.Abilities, agent.Abilities)
				.Set(a => a.LastUpTime, agent.LastUpTime)
				.Set(a => a.Availability, agent.Availability)
				.Set(a => a.Folders, agent.Folders);

			var entity = await deployCollection.FindOneAndUpdateAsync(a => a.Url == agent.Url, updater);

			return entity;
		}

		public async Task<AgentBuildEntity> Update(AgentBuild agent)
		{
			var updater = Builders<AgentBuildEntity>.Update.Set(a => a.Abilities, agent.Abilities).Set(a => a.LastUpTime, agent.LastUpTime).Set(a => a.Availability, agent.Availability);

			var entity = await buildCollection.FindOneAndUpdateAsync(a => a.Url == agent.Url, updater);

			return entity;
		}

		public async Task Delete<T>(string url) where T : AgentBaseEntity
		{
			if (typeof(T) == typeof(AgentDeployEntity))
				await deployCollection.DeleteOneAsync(a => a.Url == url);
			else if (typeof(T) == typeof(AgentBuildEntity)) await buildCollection.DeleteOneAsync(a => a.Url == url);

			throw new AmbiguousImplementationException($"The type {typeof(T)} is unknown");
		}

		public async Task<List<T>> GetAll<T>() where T : AgentBaseEntity
		{
			if (typeof(T) == typeof(AgentDeployEntity)) return await deployCollection.AsQueryable().ToListAsync() as List<T>;
			if (typeof(T) == typeof(AgentBuildEntity)) return await buildCollection.AsQueryable().ToListAsync() as List<T>;

			throw new AmbiguousImplementationException($"The type {typeof(T)} is unknown");
		}

		public async Task<T> GetByUrl<T>(string url) where T : AgentBaseEntity
		{
			if (typeof(T) == typeof(AgentDeployEntity)) return await deployCollection.AsQueryable().FirstOrDefaultAsync(agent => agent.Url == url) as T;

			if (typeof(T) == typeof(AgentBuildEntity)) return await buildCollection.AsQueryable().FirstOrDefaultAsync(agent => agent.Url == url) as T;

			throw new AmbiguousImplementationException($"The type {typeof(T)} is unknown");
		}

		public async Task<T> GetById<T>(Guid id) where T : AgentBaseEntity
		{
			if (typeof(T) == typeof(AgentDeployEntity)) return await deployCollection.AsQueryable().FirstOrDefaultAsync(agent => agent.Id.AsGuid() == id) as T;

			if (typeof(T) == typeof(AgentBuildEntity)) return await buildCollection.AsQueryable().FirstOrDefaultAsync(agent => agent.Id.AsGuid() == id) as T;

			throw new AmbiguousImplementationException($"The type {typeof(T)} is unknown");
		}
	}
}