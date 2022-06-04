using Cicd.Hub.Abstractions.Interfaces.Services;
using Cicd.Hub.Abstractions.Transports.Github;
using Cicd.Hub.Adapters.Github;

namespace Cicd.Hub.Core.Services
{
	public class GithubService : IGithubService
	{
		private readonly IAuthenticationService authenticationService;

		private readonly Dictionary<string, GitHubApi> gitHubApis = new();

		public GithubService(IAuthenticationService authenticationService)
		{
			this.authenticationService = authenticationService;
		}

		public async Task<List<GitHubRepository>> GetRepos(string userToken)
		{
			var realUsername = await authenticationService.GetUsername(userToken);
			var githubUsername = (await authenticationService.GetGithubToken(userToken)).Username;

			var api = await GetApi(realUsername, userToken);

			return await api.ListRepos(githubUsername);
		}


		private async Task<GitHubApi> GetApi(string username, string userToken)
		{
			if (gitHubApis.ContainsKey(userToken)) return gitHubApis[username];

			var githubToken = (await authenticationService.GetGithubToken(userToken)).Token;
			gitHubApis[username] = new GitHubApi(githubToken);

			return gitHubApis[username];
		}
	}
}