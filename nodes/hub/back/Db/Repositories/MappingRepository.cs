using Cicd.Hub.Abstractions.Extensions;
using Cicd.Hub.Abstractions.Models;
using Cicd.Hub.Abstractions.Transports;
using Cicd.Hub.Abstractions.Transports.Jobs.Build;
using Cicd.Hub.Abstractions.Transports.Jobs.Deploy;
using Cicd.Hub.Db.Repositories.Internal;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace Cicd.Hub.Abstractions.Interfaces.Repositories
{
	internal class MappingRepository : BaseRepository<MappingEntity>, IMappingRepository
	{
		public MappingRepository(IConfiguration configuration, ILogger<BaseRepository<MappingEntity>> logger) : base(configuration, logger) { }

		public async Task<MappingEntity> Add(BuildConfig build, DeployConfig deploy)
		{
			var entity = new MappingEntity
			{
				Build = build,
				Deploy = deploy
			};

			await EntityCollection.InsertOneAsync(entity);


			return entity;
		}

		public async Task<MappingEntity> Update(Mapping mapping)
		{
			var updater = Builders<MappingEntity>.Update.Set(m => m.Deploy, mapping.Deploy).Set(m => m.Build, mapping.Build);

			var entity = await EntityCollection.FindOneAndUpdateAsync(m => m.Id.AsGuid() == mapping.Id, updater);

			return entity;
		}

		public async Task Delete(Guid id)
		{
			await EntityCollection.DeleteOneAsync(m => m.Id.AsGuid() == id);
		}

		public async Task<List<MappingEntity>> GetAll()
		{
			return await EntityCollection.AsQueryable().ToListAsync();
		}


		public async Task<MappingEntity> GetById(Guid id)
		{
			return await EntityCollection.AsQueryable().FirstOrDefaultAsync(m => m.Id.AsGuid() == id);
		}
	}
}