using System.ComponentModel.DataAnnotations;

namespace Cicd.Hub.Abstractions.Transports.Github
{
	public class BranchDetail
	{
		[Required] public List<string> BakeFiles = new();
		[Required] public List<string> DockerComposeFiles = new();
		[Required] public List<string> Dockerfiles = new();
		[Required] public List<string> Files = new();
		[Required] public List<string> Folders = new();
		[Required] public string Name = null!;
	}
}