using Cicd.Hub.Abstractions.Interfaces.Services;
using Example.Api.Adapters.AuthenticationApi;

namespace Cicd.Hub.Core.Services
{
	internal class AuthenticationService : IAuthenticationService
	{
		private readonly IAuthenticationClient authenticationApi;
		private readonly IAuthenticationAppClient authenticationAppApi;
		private readonly ICredentialsUsersClient credentialsUsersClient;
		private readonly IUsersClient usersApi;

		public AuthenticationService(IAuthenticationClient authenticationApi, IUsersClient usersApi, IAuthenticationAppClient authenticationAppApi, ICredentialsUsersClient credentialsUsersClient)
		{
			this.authenticationApi = authenticationApi;
			this.usersApi = usersApi;
			this.authenticationAppApi = authenticationAppApi;
			this.credentialsUsersClient = credentialsUsersClient;
		}

		public async Task<bool> IsLogged(string token)
		{
			return await authenticationApi.ValidToken2Async(token);
		}

		public async Task<string> GetUsername(string token)
		{
			return await usersApi.GetUserInfoAsync(Kind.Username, token);
		}

		public async Task<string> GetPermanentToken(string token)
		{
			return await authenticationAppApi.CreatePermanentAppTokenAsync(App.CICD, token);
		}

		public async Task DeletePermanentToken(string appToken, string token)
		{
			await authenticationAppApi.DeleteTokensAsync(App3.CICD, appToken, token);
		}

		public async Task<(string Username, string Token)> GetGithubToken(string token)
		{
			var username = await GetUsername(token);
			var credentials = await credentialsUsersClient.Get3Async(username, token);

			if (credentials.Github == null) throw new Exception($"The user {username} doesn't have setup its github credentials");

			return (credentials.Github.User, credentials.Github.Token);
		}
	}
}