using Cicd.Hub.Abstractions.Interfaces.Repositories;
using Cicd.Hub.Abstractions.Interfaces.Services;
using Cicd.Hub.Abstractions.Transports;
using Cicd.Hub.Abstractions.Transports.Jobs.Build;
using Cicd.Hub.Abstractions.Transports.Jobs.Deploy;
using Cicd.Hub.Core.Assemblers;

namespace Cicd.Hub.Core.Services
{
	public class MappingService : IMappingService
	{
		private readonly MappingAssembler mappingAssembler = new();

		private readonly IMappingRepository mappingRepository;

		public MappingService(IMappingRepository mappingRepository)
		{
			this.mappingRepository = mappingRepository;
		}

		public async Task Delete(Guid id)
		{
			await mappingRepository.Delete(id);
		}

		public async Task<Mapping> Add(BuildConfig build, DeployConfig deploy)
		{
			var entity = await mappingRepository.Add(build, deploy);
			return mappingAssembler.Convert(entity)!;
		}

		public async Task<List<Mapping>> GetAll()
		{
			var entities = await mappingRepository.GetAll();
			return mappingAssembler.Convert(entities!)!;
		}

		public async Task<Mapping?> GetById(Guid id)
		{
			var entity = await mappingRepository.GetById(id);
			return mappingAssembler.Convert(entity)!;
		}
	}
}