using Cicd.Hub.Abstractions.Common.Assemblers;
using Cicd.Hub.Abstractions.Common.Extensions;
using Cicd.Hub.Abstractions.Models.Jobs;
using Cicd.Hub.Abstractions.Transports.Jobs.Build;
using Cicd.Hub.Abstractions.Transports.Jobs.Deploy;

namespace Cicd.Hub.Core.Assemblers
{
	public static class JobAssembler
	{
		public class Build : BaseAssembler<JobBuild, JobBuildEntity>
		{
			public override JobBuildEntity Convert(JobBuild obj)
			{
				return new JobBuildEntity
				{
					Config = obj.Config,
					CreatedAt = obj.CreatedAt,
					FinishedAt = obj.FinishedAt,
					Id = obj.Id.AsObjectId(),
					Token = obj.Token,
					StartedAt = obj.StartedAt,
					Stderr = obj.Stderr,
					Stdout = obj.Stdout
				};
			}

			public override JobBuild Convert(JobBuildEntity obj)
			{
				return new JobBuild
				{
					Config = obj.Config,
					CreatedAt = obj.CreatedAt,
					FinishedAt = obj.FinishedAt,
					Id = obj.Id.AsGuid(),
					Token = obj.Token,
					StartedAt = obj.StartedAt,
					Stderr = obj.Stderr,
					Stdout = obj.Stdout
				};
			}
		}

		public class Deploy : BaseAssembler<JobDeploy, JobDeployEntity>
		{
			public override JobDeployEntity Convert(JobDeploy obj)
			{
				return new JobDeployEntity
				{
					Config = obj.Config,
					CreatedAt = obj.CreatedAt,
					FinishedAt = obj.FinishedAt,
					Id = obj.Id.AsObjectId(),
					Token = obj.Token,
					StartedAt = obj.StartedAt,
					Stderr = obj.Stderr,
					Stdout = obj.Stdout
				};
			}

			public override JobDeploy Convert(JobDeployEntity obj)
			{
				return new JobDeploy
				{
					Config = obj.Config,
					CreatedAt = obj.CreatedAt,
					FinishedAt = obj.FinishedAt,
					Id = obj.Id.AsGuid(),
					Token = obj.Token,
					StartedAt = obj.StartedAt,
					Stderr = obj.Stderr,
					Stdout = obj.Stdout
				};
			}
		}
	}
}