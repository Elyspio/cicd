using Cicd.Hub.Abstractions.Interfaces.Services;
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
	}
}