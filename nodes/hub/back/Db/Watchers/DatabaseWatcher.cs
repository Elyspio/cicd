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

		public void WatchChanges()
		{
			
			WatchCollection("Jobs.Build");
			WatchCollection("Jobs.Deploy");
			WatchCollection("Mapping");
			WatchCollection("Agents.Build");
			WatchCollection("Agents.Deploy");
				
		}


		private void WatchCollection(string name)
		{
			Task.Run(() => {
					var cursor = context.MongoDatabase.GetCollection<BsonDocument>(name).Watch();

					while (cursor.MoveNext())
					{
						if (!cursor.Current.Any()) continue;
						Console.WriteLine($"{DateTime.Now.ToLongTimeString()} - Received {name} {cursor.Current.Count()} changes from database.");
						configService.Update();
					}
				}
			);
		}
	}
}