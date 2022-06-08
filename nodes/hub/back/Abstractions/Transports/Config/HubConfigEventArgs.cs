namespace Cicd.Hub.Abstractions.Transports.Config
{
	public class HubConfigEventArgs : EventArgs
	{
		public HubConfig Config { get; set; }
	}
}