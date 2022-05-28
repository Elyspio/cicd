﻿using Cicd.Hub.Abstractions.Interfaces.Services;
using Example.Api.Adapters.AuthenticationApi;

namespace Cicd.Hub.Core.Services
{
	internal class AuthenticationService : IAuthenticationService
	{
		private readonly IAuthenticationClient authenticationApi;
		private readonly IAuthenticationAppClient authenticationAppApi;
		private readonly IUsersClient usersApi;

		public AuthenticationService(IAuthenticationClient authenticationApi, IUsersClient usersApi, IAuthenticationAppClient authenticationAppApi)
		{
			this.authenticationApi = authenticationApi;
			this.usersApi = usersApi;
			this.authenticationAppApi = authenticationAppApi;
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
	}
}