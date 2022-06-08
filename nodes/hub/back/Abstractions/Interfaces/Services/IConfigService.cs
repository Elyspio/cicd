using Cicd.Hub.Abstractions.Transports.Config;

namespace Cicd.Hub.Abstractions.Interfaces.Services
{
	public interface IConfigService
	{
		Task Update();

		event EventHandler<HubConfigEventArgs> OnUpdate;

		Task<HubConfig> Get();
	}
}