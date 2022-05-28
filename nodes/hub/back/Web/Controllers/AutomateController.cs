using Cicd.Hub.Abstractions.Interfaces.Services;
using Cicd.Hub.Abstractions.Transports.Jobs.Build;
using Cicd.Hub.Abstractions.Transports.Jobs.Deploy;
using Cicd.Hub.Web.Utils;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Cicd.Hub.Web.Controllers
{
	[Route("api/automate")]
	[ApiController]
	public class AutomateController : ControllerBase
	{
		private readonly IAutomateService automateService;

		public AutomateController(IAutomateService automateService)
		{
			this.automateService = automateService;
		}

		[HttpPost("build")]
		[SwaggerResponse(204)]
		public async Task<IActionResult> Build(BuildConfig config)
		{
			await automateService.AskBuild(config, AuthHelper.GetToken(Request));
			return NoContent();
		}

		[HttpPost("deploy")]
		[SwaggerResponse(204)]
		public async Task<IActionResult> Deploy(DeployConfig config)
		{
			await automateService.AskDeploy(config, AuthHelper.GetToken(Request));
			return NoContent();
		}
	}
}