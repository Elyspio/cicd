using Cicd.Hub.Abstractions.Common.Assemblers;
using Cicd.Hub.Abstractions.Common.Extensions;
using Cicd.Hub.Abstractions.Models.Agents;
using Cicd.Hub.Abstractions.Models.Agents.Deploy;
using Cicd.Hub.Abstractions.Transports.Agents;
using Cicd.Hub.Abstractions.Transports.Agents.Deploy;

namespace Cicd.Hub.Core.Assemblers
{
	public static class AgentAssembler
	{
		public class Build : BaseAssembler<AgentBuild, AgentBuildEntity>
		{
			public override AgentBuildEntity Convert(AgentBuild obj)
			{
				return new AgentBuildEntity
				{
					Id = obj.Id.AsObjectId(),
					Url = obj.Url,
					Abilities = obj.Abilities,
					Availability = obj.Availability,
					LastUpTime = obj.LastUpTime
				};
			}

			public override AgentBuild Convert(AgentBuildEntity obj)
			{
				return new AgentBuild
				{
					Id = obj.Id.AsGuid(),
					Url = obj.Url,
					Abilities = obj.Abilities,
					Availability = obj.Availability,
					LastUpTime = obj.LastUpTime
				};
			}
		}

		public class Deploy : BaseAssembler<AgentDeploy, AgentDeployEntity>
		{
			public override AgentDeployEntity Convert(AgentDeploy obj)
			{
				return new AgentDeployEntity
				{
					Id = obj.Id.AsObjectId(),
					Url = obj.Url,
					Abilities = obj.Abilities,
					Availability = obj.Availability,
					LastUpTime = obj.LastUpTime,
					Folders = obj.Folders
				};
			}

			public override AgentDeploy Convert(AgentDeployEntity obj)
			{
				return new AgentDeploy
				{
					Id = obj.Id.AsGuid(),
					Url = obj.Url,
					Abilities = obj.Abilities,
					Availability = obj.Availability,
					LastUpTime = obj.LastUpTime,
					Folders = obj.Folders
				};
			}
		}
	}
}