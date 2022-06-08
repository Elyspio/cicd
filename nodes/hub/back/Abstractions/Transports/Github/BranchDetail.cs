using System.ComponentModel.DataAnnotations;

namespace Cicd.Hub.Abstractions.Transports.Github
{
	public class BranchDetail
	{
		[Required] public List<string> BakeFiles { get; set; } = new();
		[Required] public List<string> DockerComposeFiles { get; set; } = new();
		[Required] public List<string> Dockerfiles { get; set; } = new();
		[Required] public List<string> Files { get; set; } = new();
		[Required] public List<string> Folders { get; set; } = new();
		[Required] public string Name { get; set; } = null!;
	}
}