using Cicd.Hub.Abstractions.Interfaces.Services;
using Cicd.Hub.Abstractions.Models.Agents.Deploy;
using Cicd.Hub.Abstractions.Transports.Agents;
using Cicd.Hub.Abstractions.Transports.Agents.Deploy;
using Cicd.Hub.Web.Server.Utils;
using Cicd.Hub.Web.Server.Utils.Filters;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Cicd.Hub.Web.Controllers.Operations
{
	[Route("api/operations/agents", Name = "Operation.Agents")]
	[RequireAuth]
	public class AgentOperationController : ControllerBase
	{
		private readonly IAgentService agentService;

		private readonly IJobService jobService;

		public AgentOperationController(IJobService jobService, IAgentService agentService)
		{
			this.jobService = jobService;
			this.agentService = agentService;
		}


		[HttpGet("production/apps")]
		[SwaggerResponse(200, Type = typeof(List<ProductionApps>))]
		public async Task<IActionResult> GetProductionApps()
		{
			var apps = await agentService.GetProductionApps(AuthHelper.GetToken(Request));
			return Ok(apps);
		}


		[HttpGet("build")]
		[SwaggerResponse(200, Type = typeof(List<AgentBuild>))]
		public async Task<IActionResult> GetBuildJobs()
		{
			var data = await agentService.GetAll<AgentBuild>();
			return Ok(data);
		}

		[HttpGet("deploy")]
		[SwaggerResponse(200, Type = typeof(List<AgentDeploy>))]
		public async Task<IActionResult> GetDeployJobs()
		{
			var data = await agentService.GetAll<AgentDeploy>();
			return Ok(data);
		}
	}
}