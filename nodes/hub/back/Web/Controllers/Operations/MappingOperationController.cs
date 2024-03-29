﻿using System.ComponentModel.DataAnnotations;
using Cicd.Hub.Abstractions.Interfaces.Services;
using Cicd.Hub.Abstractions.Transports;
using Cicd.Hub.Web.Models.Requests;
using Cicd.Hub.Web.Server.Utils;
using Cicd.Hub.Web.Server.Utils.Filters;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Cicd.Hub.Web.Controllers.Operations
{
	[Route("api/operations/mappings", Name = "Operation.Mappings")]
	[RequireAuth]
	public class MappingOperationController : ControllerBase
	{
		private readonly IAuthenticationService authenticationService;
		private readonly IAutomateService automateService;
		private readonly IJobService jobService;

		private readonly IMappingService mappingService;

		public MappingOperationController(IMappingService mappingService, IAutomateService automateService, IJobService jobService, IAuthenticationService authenticationService)
		{
			this.mappingService = mappingService;
			this.automateService = automateService;
			this.jobService = jobService;
			this.authenticationService = authenticationService;
		}

		[HttpDelete("{id:guid}")]
		[SwaggerResponse(204, Type = typeof(void))]
		public async Task<IActionResult> Delete(Guid id)
		{
			await mappingService.Delete(id);
			return NoContent();
		}


		[HttpPost("")]
		[SwaggerResponse(201, Type = typeof(Mapping))]
		public async Task<IActionResult> Add([Required] [FromBody] AddMappingRequest request)
		{
			var mapping = await mappingService.Add(request.Build, request.Deploy);

			return Created($"/api/operations/mappings/{mapping.Id}", mapping);
		}

		[HttpGet("")]
		[SwaggerResponse(200, Type = typeof(List<Mapping>))]
		public async Task<IActionResult> GetAll()
		{
			return Ok(await mappingService.GetAll());
		}


		[HttpPost("{id:guid}/run")]
		[SwaggerResponse(200)]
		public async Task<IActionResult> Run(Guid id)
		{
			var mapping = await mappingService.GetById(id);
			if (mapping == null) return NotFound($"Could not find mapping with id {id}");

			var token = AuthHelper.GetToken(Request);

			var run = Guid.NewGuid();

			var build = await automateService.AskBuild(mapping.Build, token, run);
			await jobService.WaitForJob(build.Id);
			var deploy = await automateService.AskDeploy(mapping.Deploy, token, run);
			await jobService.WaitForJob(deploy.Id);

			await Task.WhenAll(authenticationService.DeletePermanentToken(build.Token, token), authenticationService.DeletePermanentToken(deploy.Token, token));

			return NoContent();
		}
	}
}