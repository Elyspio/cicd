using Cicd.Hub.Abstractions.Common.Helpers;
using Cicd.Hub.Db.Configs;
using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;

namespace Cicd.Hub.Db.Repositories.Internal
{
	public class MongoContext
	{
		public MongoContext(IConfiguration configuration)
		{
			var conf = new DbConfig();
			configuration.GetSection(DbConfig.Section).Bind(conf);

			var host = Env.Get("DB_HOST", conf.Host);
			var username = Env.Get("DB_USERNAME", conf.Username);
			var password = Env.Get("DB_PASSWORD", conf.Password);
			var database = Env.Get("DB_DATABASE", conf.Database);
			var port = Env.Get<int>("DB_PORT", conf.Port);

			var client = new MongoClient($"mongodb://{username}:{password}@{host}:{port}??replicaSet=rs0&minPoolSize=20&maxPoolSize=1000&connectTimeoutMS=10000");
			Console.WriteLine($"Connecting to Database '{database}' on {host}:{port} as {username}");
			MongoDatabase = client.GetDatabase(database);

			var pack = new ConventionPack
			{
				new EnumRepresentationConvention(BsonType.String)
			};
			ConventionRegistry.Register("EnumStringConvention", pack, t => true);
			BsonSerializer.RegisterSerializationProvider(new EnumAsStringSerializationProvider());

			//BsonSerializer.RegisterSerializer(new GuidSerializer(GuidRepresentation.Unspecified));
		}

		/// <summary>
		///     Récupération de la IMongoDatabase
		/// </summary>
		/// <returns></returns>
		public IMongoDatabase MongoDatabase { get; }
	}
}