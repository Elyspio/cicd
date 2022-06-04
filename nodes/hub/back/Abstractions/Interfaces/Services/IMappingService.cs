using Cicd.Hub.Abstractions.Transports;
using Cicd.Hub.Abstractions.Transports.Jobs.Build;
using Cicd.Hub.Abstractions.Transports.Jobs.Deploy;

namespace Cicd.Hub.Abstractions.Interfaces.Services
{
	public interface IMappingService
	{
		public Task Delete(Guid id);

		public Task<Mapping> Add(BuildConfig build, DeployConfig deploy);

		public Task<List<Mapping>> GetAll();

		public Task<Mapping?> GetById(Guid id);
	}
}