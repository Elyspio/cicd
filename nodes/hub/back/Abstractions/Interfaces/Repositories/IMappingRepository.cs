using Cicd.Hub.Abstractions.Models;
using Cicd.Hub.Abstractions.Transports;
using Cicd.Hub.Abstractions.Transports.Jobs.Build;
using Cicd.Hub.Abstractions.Transports.Jobs.Deploy;

namespace Cicd.Hub.Abstractions.Interfaces.Repositories
{
	public interface IMappingRepository
	{
		Task<MappingEntity> Add(BuildConfig build, DeployConfig deploy);
		Task<MappingEntity> Update(Mapping mapping);
		Task Delete(Guid id);
		Task<List<MappingEntity>> GetAll();
		Task<MappingEntity> GetById(Guid id);
	}
}