using Cicd.Hub.Abstractions.Interfaces.Services;
using Cicd.Hub.Abstractions.Transports.Github;
using Cicd.Hub.Web.Server.Utils;
using Cicd.Hub.Web.Server.Utils.Filters;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace Cicd.Hub.Web.Controllers
{
	[Route("api/github")]
	public class GitHubController : ControllerBase
	{
		private readonly IGithubService githubService;

		public GitHubController(IGithubService githubService)
		{
			this.githubService = githubService;
		}

		[HttpGet("users/connected/nodes")]
		[SwaggerResponse(200, Type = typeof(List<GitHubRepository>))]
		[RequireAuth]
		public async Task<IActionResult> GetRepos()
		{
			return Ok(await githubService.GetRepos(AuthHelper.GetToken(Request)));
		}
	}
}