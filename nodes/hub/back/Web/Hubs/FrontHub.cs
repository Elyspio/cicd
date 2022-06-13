using Cicd.Hub.Abstractions.Interfaces.Services;
using Cicd.Hub.Abstractions.Transports.Config;
using Microsoft.AspNetCore.SignalR;

namespace Cicd.Hub.Web.Hubs
{
	public class FrontHub : Microsoft.AspNetCore.SignalR.Hub
	{

		public static string UpdateConfigEvent = "config-updated";

		private readonly IConfigService configService;

		public FrontHub(IConfigService configService)
		{
			this.configService = configService;
		}



		public override async Task OnConnectedAsync()
		{
			await Clients.Caller.SendAsync(UpdateConfigEvent, await configService.Get());
			await base.OnConnectedAsync();
		}
	}
}