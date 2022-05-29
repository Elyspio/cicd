using Cicd.Hub.Abstractions.Interfaces.Services;
using Cicd.Hub.Web.Filters;
using Cicd.Hub.Web.Utils;
using Microsoft.AspNetCore.Mvc;

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
		[RequireAuth]
		public async Task<IActionResult> GetRepos()
		{
			return Ok(await githubService.GetRepos(AuthHelper.GetToken(Request)));
		}
	}
}