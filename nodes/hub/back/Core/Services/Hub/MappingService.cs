using Cicd.Hub.Abstractions.Common.Helpers;
using Cicd.Hub.Abstractions.Interfaces.Repositories;
using Cicd.Hub.Abstractions.Interfaces.Services;
using Cicd.Hub.Abstractions.Transports;
using Cicd.Hub.Abstractions.Transports.Jobs.Build;
using Cicd.Hub.Abstractions.Transports.Jobs.Deploy;
using Cicd.Hub.Core.Assemblers;
using Microsoft.Extensions.Logging;

namespace Cicd.Hub.Core.Services.Hub
{
	public class MappingService : IMappingService
	{
		private readonly ILogger<MappingService> logger;
		private readonly MappingAssembler mappingAssembler = new();

		private readonly IMappingRepository mappingRepository;

		public MappingService(IMappingRepository mappingRepository, ILogger<MappingService> logger)
		{
			this.mappingRepository = mappingRepository;
			this.logger = logger;
		}

		public async Task Delete(Guid id)
		{
			logger.Enter($"{LogHelper.Get(id)}");
			await mappingRepository.Delete(id);
			logger.Exit($"{LogHelper.Get(id)}");
		}

		public async Task<Mapping> Add(BuildConfig build, DeployConfig deploy)
		{
			logger.Enter($"{LogHelper.Get(build.Github.Remote)} {LogHelper.Get(build.Github.Branch)} {deploy.Url}");
			var entity = await mappingRepository.Add(build, deploy);
			var data = mappingAssembler.Convert(entity)!;
			logger.Exit($"{LogHelper.Get(build.Github.Remote)} {LogHelper.Get(build.Github.Branch)} {deploy.Url}");
			return data;
		}

		public async Task<List<Mapping>> GetAll()
		{
			logger.Enter();
			var entities = await mappingRepository.GetAll();
			var data = mappingAssembler.Convert(entities!);
			logger.Exit();
			return data!;
		}

		public async Task<Mapping?> GetById(Guid id)
		{
			logger.Enter($"{LogHelper.Get(id)}");
			var entity = await mappingRepository.GetById(id);
			var data = mappingAssembler.Convert(entity!);
			logger.Exit($"{LogHelper.Get(id)}");
			return data;
		}
	}
}