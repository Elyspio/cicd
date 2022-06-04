using Cicd.Hub.Abstractions.Transports.Github;

namespace Cicd.Hub.Abstractions.Interfaces.Services
{
	public interface IGithubService
	{
		/// <summary>
		///     Get all github repos for this user
		/// </summary>
		/// <param name="userToken"></param>
		/// <returns></returns>
		Task<List<GitHubRepository>> GetRepos(string userToken);
	}
}