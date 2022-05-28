using Cicd.Hub.Abstractions.Interfaces.Injections;
using Cicd.Hub.Adapters.Configs;
using Example.Api.Adapters.AuthenticationApi;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Cicd.Hub.Adapters.Injections
{
	public class AdapterModule : IDotnetModule
	{
		public void Load(IServiceCollection services, IConfiguration configuration)
		{
			var conf = new EndpointConfig();
			configuration.GetSection(EndpointConfig.Section).Bind(conf);

			services.AddHttpClient<IUsersClient, UsersClient>(client => { client.BaseAddress = new Uri(conf.Authentication); });
			services.AddHttpClient<IAuthenticationClient, AuthenticationClient>(client => { client.BaseAddress = new Uri(conf.Authentication); });
			services.AddHttpClient<IAuthenticationAppClient, AuthenticationAppClient>(client => { client.BaseAddress = new Uri(conf.Authentication); });
		}
	}
}