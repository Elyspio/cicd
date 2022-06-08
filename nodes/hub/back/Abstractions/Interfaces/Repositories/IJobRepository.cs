using Cicd.Hub.Abstractions.Enums.Jobs;
using Cicd.Hub.Abstractions.Models.Jobs;
using Cicd.Hub.Abstractions.Transports.Jobs.Build;
using Cicd.Hub.Abstractions.Transports.Jobs.Deploy;

namespace Cicd.Hub.Abstractions.Interfaces.Repositories
{
	public interface IJobRepository
	{
		Task<JobBuildEntity> Add(BuildConfig config, string token);
		Task<JobDeployEntity> Add(DeployConfig config, string token);
		Task<JobBuildEntity> Update(JobBuild job);
		Task<JobDeployEntity> Update(JobDeploy job);
		Task Delete(Guid id);
		Task<List<T>> GetAll<T>() where T : JobBaseEntity;
		Task<T?> GetById<T>(Guid id) where T : JobBaseEntity;
		Task AddStdout(Guid id, StdType type, string message);
		Task<List<T>> GetPendingJobs<T>() where T : JobBaseEntity;
	}
}