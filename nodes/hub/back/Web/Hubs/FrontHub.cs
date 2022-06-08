using Cicd.Hub.Abstractions.Interfaces.Services;
using Cicd.Hub.Abstractions.Transports.Config;
using Microsoft.AspNetCore.SignalR;

namespace Cicd.Hub.Web.Hubs
{
	public class FrontHub : Microsoft.AspNetCore.SignalR.Hub
	{
		private readonly IConfigService configService;

		public FrontHub(IConfigService configService)
		{
			this.configService = configService;
			configService.OnUpdate += (s, e) => { UpdateConfig(e.Config); };
		}

		private async Task UpdateConfig(HubConfig config)
		{
			await Clients.All.SendAsync("config-updated", config);
		}

		public override async Task OnConnectedAsync()
		{
			await Clients.Caller.SendAsync("config-updated", await configService.Get());
			await base.OnConnectedAsync();
		}
	}
}