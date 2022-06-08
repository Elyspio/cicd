namespace Cicd.Hub.Abstractions.Interfaces.Watchers
{
	public interface IDatabaseWatcher
	{
		public Task WatchChanges();
	}
}