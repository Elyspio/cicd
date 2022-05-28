using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Cicd.Hub.Abstractions.Transports.Jobs
{
	public abstract class JobBase
	{
		private readonly TaskCompletionSource tcs = new(false);

		[Required] public DateTime CreatedAt { get; set; } = DateTime.Now;

		public DateTime? FinishedAt { get; set; }
		public DateTime? StartedAt { get; set; }

		[Required] public Guid Id { get; set; } = Guid.Empty;

		public string? Stdout { get; set; }
		public string? Stderr { get; set; }
		[JsonIgnore] public string Token { get; init; } = null!;

		public event EventHandler Finished = (sender, args) => { };

		public void Finish()
		{
			Finished.Invoke(this, EventArgs.Empty);
			tcs.SetResult();
		}

		public Task Wait()
		{
			return tcs.Task.WaitAsync(new CancellationToken());
		}
	}
}