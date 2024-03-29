﻿using System.ComponentModel.DataAnnotations;
using Cicd.Hub.Abstractions.Interfaces.Services;
using Cicd.Hub.Abstractions.Transports.Config;
using Cicd.Hub.Abstractions.Transports.Jobs.Build;
using Cicd.Hub.Abstractions.Transports.Jobs.Deploy;
using Cicd.Hub.Web.Server.Utils;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Cicd.Hub.Web.Controllers
{
	[Route("api/automate")]
	[ApiController]
	public class AutomateController : ControllerBase
	{
		private readonly IAutomateService automateService;
		private readonly IConfigService configService;

		public AutomateController(IAutomateService automateService, IConfigService configService)
		{
			this.automateService = automateService;
			this.configService = configService;
		}

		[HttpPost("build")]
		[SwaggerResponse(204)]
		public async Task<IActionResult> Build([Required] [FromBody] BuildConfig config)
		{
			await automateService.AskBuild(config, AuthHelper.GetToken(Request), Guid.NewGuid());
			return NoContent();
		}

		[HttpPost("deploy")]
		[SwaggerResponse(204)]
		public async Task<IActionResult> Deploy([Required] [FromBody] DeployConfig config)
		{
			await automateService.AskDeploy(config, AuthHelper.GetToken(Request), Guid.NewGuid());
			return NoContent();
		}


		[HttpGet("config")]
		[SwaggerResponse(200, Type = typeof(HubConfig))]
		public async Task<IActionResult> GetConfig()
		{
			var config = await configService.Get();
			return Ok(config);
		}
	}
}