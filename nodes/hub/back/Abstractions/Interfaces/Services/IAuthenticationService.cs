namespace Cicd.Hub.Abstractions.Interfaces.Services
{
	public interface IAuthenticationService
	{
		Task<bool> IsLogged(string token);
		Task<string> GetUsername(string token);

		/// <summary>
		///     Create a permanent app token for this app
		/// </summary>
		/// <param name="token"></param>
		/// <returns></returns>
		Task<string> GetPermanentToken(string token);

		Task DeletePermanentToken(string appToken, string token);

		Task<(string Username, string Token)> GetGithubToken(string token);
	}
}