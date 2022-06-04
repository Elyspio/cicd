using System.ComponentModel.DataAnnotations;

namespace Cicd.Hub.Abstractions.Transports.Github
{
	public class GitHubRepository
	{
		[Required] public Dictionary<string, BranchDetail> Branches = new();

		[Required] public string Name { get; set; } = null!;
	}
}