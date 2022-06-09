using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Cicd.Hub.Abstractions.Transports.Jobs
{
	public abstract class JobBaseRaw
	{
		[Required] public DateTime CreatedAt { get; set; } = DateTime.Now;

		public DateTime? FinishedAt { get; set; }
		public DateTime? StartedAt { get; set; }

		[Required] public Guid Run { get; set; }
		public string? Stdout { get; set; }
		public string? Stderr { get; set; }
		[JsonIgnore] public string Token { get; init; } = null!;
	}
}