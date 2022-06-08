using Cicd.Hub.Abstractions.Common.Extensions;
using Cicd.Hub.Abstractions.Common.Helpers;
using Cicd.Hub.Abstractions.Interfaces.Services;
using Cicd.Hub.Abstractions.Transports.Github;
using Cicd.Hub.Adapters.Github;
using Microsoft.Extensions.Logging;

namespace Cicd.Hub.Core.Services
{
	public class GithubService : IGithubService
	{
		private readonly IAuthenticationService authenticationService;
		private readonly Dictionary<string, GitHubApi> gitHubApis = new();
		private readonly ILogger<GithubService> logger;

		public GithubService(IAuthenticationService authenticationService, ILogger<GithubService> logger)
		{
			this.authenticationService = authenticationService;
			this.logger = logger;
		}

		public async Task<List<GitHubRepository>> GetRepos(string userToken)
		{
			logger.Enter(LogHelper.Get(userToken));
			var realUsername = await authenticationService.GetUsername(userToken);
			var githubUsername = (await authenticationService.GetGithubToken(userToken)).Username;

			var api = await GetApi(realUsername, userToken);

			var repos = await api.ListRepos(githubUsername);

			// Only return with at least one dockerfiles else we can't build it
			repos = repos.Where(repo => { return repo.Branches.Values.Any(branch => branch.Dockerfiles.Any()); }).ToList();

			logger.Exit($"{LogHelper.Get(userToken)} {LogHelper.Get(repos.Count)}");
			return repos;
		}


		private async Task<GitHubApi> GetApi(string username, string userToken)
		{
			logger.Enter($"{LogHelper.Get(userToken)} {LogHelper.Get(userToken)}");
			if (gitHubApis.ContainsKey(userToken)) return gitHubApis[username];

			var githubToken = (await authenticationService.GetGithubToken(userToken)).Token;
			gitHubApis[username] = new GitHubApi(githubToken);

			var api = gitHubApis[username];
			logger.Exit($"{LogHelper.Get(userToken)} {LogHelper.Get(userToken)}");
			return api;
		}
	}
}