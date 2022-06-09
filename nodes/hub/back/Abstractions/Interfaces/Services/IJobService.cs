using Cicd.Hub.Abstractions.Enums.Jobs;
using Cicd.Hub.Abstractions.Transports.Jobs;
using Cicd.Hub.Abstractions.Transports.Jobs.Build;
using Cicd.Hub.Abstractions.Transports.Jobs.Deploy;

namespace Cicd.Hub.Abstractions.Interfaces.Services
{
	public interface IJobService
	{
		Task<JobBuild> Add(BuildConfig config, string token, Guid run);
		Task<JobDeploy> Add(DeployConfig config, string token, Guid run);
		Task<JobBuild> Update(JobBuild job);
		Task<JobDeploy> Update(JobDeploy job);
		Task Delete(Guid id);
		Task<List<T>> GetAll<T>() where T : JobBase;
		Task<T> GetById<T>(Guid id) where T : JobBase;
		Task WaitForJob(Guid id);

		Task AddStd(Guid id, StdType type, string std);

		Task<List<T>> GetPending<T>() where T : JobBase;

		void SetJobCompleted(Guid id);
	}
}