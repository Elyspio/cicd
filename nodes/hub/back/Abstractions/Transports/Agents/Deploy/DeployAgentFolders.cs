using System.ComponentModel.DataAnnotations;

namespace Cicd.Hub.Abstractions.Transports.Agents.Deploy
{
	public class DeployAgentFolders
	{
		[Required] public string[] Apps { get; set; }
	}
}