using Cicd.Hub.Abstractions.Interfaces.Services;
using Cicd.Hub.Abstractions.Interfaces.Watchers;
using Cicd.Hub.Db.Repositories.Internal;
using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
using MongoDB.Driver;

namespace Cicd.Hub.Db.Watchers
{
	public class DatabaseWatcher : IDatabaseWatcher
	{
		private readonly IConfigService configService;
		private readonly MongoContext context;

		public DatabaseWatcher(IConfiguration configuration, IConfigService configService)
		{
			this.configService = configService;
			context = new MongoContext(configuration);
		}

		public async Task WatchChanges()
		{
			using var cursor = await context.MongoDatabase.WatchAsync(new EmptyPipelineDefinition<ChangeStreamDocument<BsonDocument>>());
			await cursor.ForEachAsync(change => { configService.Update(); });
		}
	}
}