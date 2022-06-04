using Cicd.Hub.Abstractions.Transports.Github;
using Octokit;

namespace Cicd.Hub.Adapters.Github
{
	public class GitHubApi
	{
		private readonly GitHubClient client;


		public GitHubApi(string githubToken)
		{
			client = new GitHubClient(new ProductHeaderValue("cicd"))
			{
				Credentials = new Credentials(githubToken)
			};
		}


		public async Task<List<GitHubRepository>> ListRepos(string username)
		{
			var allRepos = await client.Repository.GetAllForUser(username);

			var repos = allRepos.Where(repo => !repo.Archived).ToList();


			var tasks = repos.Select(ParseRepository).ToList();

			return (await Task.WhenAll(tasks)).ToList();
		}

		private async Task<GitHubRepository> ParseRepository(Repository repository)
		{
			var obj = new GitHubRepository
			{
				Name = repository.Name
			};


			var allBranches = await client.Repository.Branch.GetAll(repository.Id);

			var branches = allBranches.Where(branch => !branch.Name.Contains("dependabot"));

			var branchDetails = (await Task.WhenAll(branches.Select(branch => GetBranchDetail(repository, branch)).ToArray())).ToList();

			branchDetails.ForEach(detail => { obj.Branches[detail.Name] = detail; });

			return obj;
		}

		private async Task<BranchDetail> GetBranchDetail(Repository repository, Branch branch)
		{
			var infos = await client.Git.Tree.GetRecursive(repository.Id, branch.Commit.Sha);
			var obj = new BranchDetail
			{
				Name = branch.Name,
				BakeFiles = infos.Tree.Where(node => node.Path.ToLower().Contains("docker-bake")).Select(node => node.Path).ToList(),
				Dockerfiles = infos.Tree.Where(node => node.Path.ToLower().Contains("dockerfile")).Select(node => node.Path).ToList(),
				DockerComposeFiles = infos.Tree.Where(node => node.Path.ToLower().Contains("docker-compose")).Select(node => node.Path).ToList(),
				Files = infos.Tree.Where(node => node.Type.Value == TreeType.Blob).Select(node => node.Path).ToList(),
				Folders = infos.Tree.Where(node => node.Type.Value == TreeType.Tree).Select(node => node.Path).ToList()
			};

			return obj;
		}
	}
}