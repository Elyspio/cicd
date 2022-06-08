using System.Runtime;
using Cicd.Hub.Abstractions.Common.Extensions;
using Cicd.Hub.Abstractions.Enums.Agents;
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

			buildCollection = context.MongoDatabase.GetCollection<AgentBuildEntity>("Agents.Build");
			deployCollection = context.MongoDatabase.GetCollection<AgentDeployEntity>("Agents.Deploy");
		}


		public async Task<AgentBuildEntity> Add(AgentBuild agent)
		{
			var updater = Builders<AgentBuildEntity>.Update.Set(a => a.Availability, agent.Availability).Set(a => a.Abilities, agent.Abilities).Set(a => a.LastUpTime, DateTime.Now);
			;
			return await buildCollection.FindOneAndUpdateAsync(a => a.Url == agent.Url, updater, new() {IsUpsert = true});
		}


		public async Task<AgentDeployEntity> Add(AgentDeploy agent)
		{
			var updater = Builders<AgentDeployEntity>.Update.Set(a => a.Availability, agent.Availability)
				.Set(a => a.Abilities, agent.Abilities)
				.Set(a => a.Folders, agent.Folders)
				.Set(a => a.LastUpTime, DateTime.Now);

			return await deployCollection.FindOneAndUpdateAsync(a => a.Url == agent.Url, updater, new() {IsUpsert = true});
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

		public async Task Delete(string url)
		{
			await Task.WhenAll(deployCollection.DeleteOneAsync(agent => agent.Url == url), buildCollection.DeleteOneAsync(agent => agent.Url == url));
		}

		public async Task<List<T>> GetAll<T>() where T : AgentBaseEntity
		{
			if (typeof(T) == typeof(AgentDeployEntity)) return await deployCollection.AsQueryable().ToListAsync() as List<T> ?? new List<T>();
			if (typeof(T) == typeof(AgentBuildEntity)) return await buildCollection.AsQueryable().ToListAsync() as List<T> ?? new List<T>();

			throw new AmbiguousImplementationException($"The type {typeof(T)} is unknown");
		}

		public async Task<List<T>> GetAvailable<T>() where T : AgentBaseEntity
		{
			if (typeof(T) == typeof(AgentDeployEntity))
				return await deployCollection.AsQueryable().Where(agent => agent.Availability == AgentAvailability.Free).ToListAsync() as List<T> ?? new List<T>();
			if (typeof(T) == typeof(AgentBuildEntity))
				return await buildCollection.AsQueryable().Where(agent => agent.Availability == AgentAvailability.Free).ToListAsync() as List<T> ?? new List<T>();

			throw new AmbiguousImplementationException($"The type {typeof(T)} is unknown");
		}

		public async Task<T?> GetByUrl<T>(string url) where T : AgentBaseEntity
		{
			if (typeof(T) == typeof(AgentDeployEntity)) return await deployCollection.AsQueryable().FirstOrDefaultAsync(agent => agent.Url == url) as T;

			if (typeof(T) == typeof(AgentBuildEntity)) return await buildCollection.AsQueryable().FirstOrDefaultAsync(agent => agent.Url == url) as T;

			throw new AmbiguousImplementationException($"The type {typeof(T)} is unknown");
		}

		public async Task<T?> GetById<T>(Guid id) where T : AgentBaseEntity
		{
			if (typeof(T) == typeof(AgentDeployEntity)) return await deployCollection.AsQueryable().FirstOrDefaultAsync(agent => agent.Id == id.AsObjectId()) as T;

			if (typeof(T) == typeof(AgentBuildEntity)) return await buildCollection.AsQueryable().FirstOrDefaultAsync(agent => agent.Id == id.AsObjectId()) as T;

			throw new AmbiguousImplementationException($"The type {typeof(T)} is unknown");
		}

		public async Task SetAvailability(Guid id, AgentAvailability availability)
		{
			if (await GetById<AgentBuildEntity>(id) != null)
			{
				var updater = Builders<AgentBuildEntity>.Update.Set(a => a.Availability, availability);
				await buildCollection.UpdateOneAsync(agent => agent.Id == id.AsObjectId(), updater);
			}


			if (await GetById<AgentDeployEntity>(id) != null)
			{
				var updater = Builders<AgentDeployEntity>.Update.Set(a => a.Availability, availability);
				await deployCollection.UpdateOneAsync(agent => agent.Id == id.AsObjectId(), updater);
			}
		}
	}
}