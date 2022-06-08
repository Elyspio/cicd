using System.ComponentModel.DataAnnotations;

namespace Cicd.Hub.Abstractions.Transports
{
	public class Mapping : MappingRaw
	{
		[Required] public Guid Id { get; set; }
	}
}