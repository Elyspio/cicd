using Cicd.Hub.Abstractions.Interfaces.Services;
using Cicd.Hub.Abstractions.Transports.Jobs.Build;
using Cicd.Hub.Abstractions.Transports.Jobs.Deploy;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Cicd.Hub.Web.Controllers.Operations
{
	[Route("api/operations/jobs", Name = "Operation.Jobs")]
	public class JobOperationController : ControllerBase
	{
		private readonly IJobService jobService;

		public JobOperationController(IJobService jobService)
		{
			this.jobService = jobService;
		}


		[HttpDelete("{id:guid}")]
		[SwaggerResponse(204, Type = typeof(void))]
		public async Task<IActionResult> Delete(Guid id)
		{
			await jobService.Delete(id);
			return NoContent();
		}

		[HttpGet("build")]
		[SwaggerResponse(200, Type = typeof(List<JobBuild>))]
		public async Task<IActionResult> GetBuildJobs()
		{
			var data = await jobService.GetAll<JobBuild>();
			return Ok(data);
		}

		[HttpGet("deploy")]
		[SwaggerResponse(200, Type = typeof(List<JobDeploy>))]
		public async Task<IActionResult> GetDeployJobs()
		{
			var data = await jobService.GetAll<JobDeploy>();
			return Ok(data);
		}
	}
}