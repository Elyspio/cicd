import * as Apis from "../api";
import {GithubPushWebhook} from "../api";

const port = 4000
describe("Rest", () => {

	beforeAll(async () => {
		// const platform = await PlatformExpress.bootstrap(Server, {httpPort: port, port});
		// await platform.listen();
	});


	describe("POST /core/github/webhook/push", () => {

		it("Push Webhook", async () => {
			const data: GithubPushWebhook = {
				"ref": "refs/heads/test-unit",
				"before": "aa912d52b1d66aa3010e9afda6c6459a18caa72d",
				"after": "9f50882ddc9aee62e161513ff43f503223980526",
				"created": false,
				"deleted": false,
				"forced": false,
				"base_ref": "",
				"compare": "https://github.com/Elyspio/automatize-github-docker/compare/aa912d52b1d6...9f50882ddc9a",
				"commits": [
					"[object Object]"
				],
				"head_commit": "[object Object]",
				"repository": {
					"id": 335889435,
					"node_id": "MDEwOlJlcG9zaXRvcnkzMzU4ODk0MzU=",
					"name": "automatize-github-docker",
					full_name: "Elyspio/automatize-github-docker",
					_private: false,
					"owner": {
						"name": "Elyspio",
						"email": "jona.guich69@gmail.com",
						"login": "Elyspio",
						"id": 22132082,
						"node_id": "MDQ6VXNlcjIyMTMyMDgy",
						"avatar_url": "https://avatars.githubusercontent.com/u/22132082?v=4",
						"gravatar_id": "",
						"url": "https://api.github.com/users/Elyspio",
						"html_url": "https://github.com/Elyspio",
						"followers_url": "https://api.github.com/users/Elyspio/followers",
						"following_url": "https://api.github.com/users/Elyspio/following{/other_user}",
						"gists_url": "https://api.github.com/users/Elyspio/gists{/gist_id}",
						"starred_url": "https://api.github.com/users/Elyspio/starred{/owner}{/repo}",
						"subscriptions_url": "https://api.github.com/users/Elyspio/subscriptions",
						"organizations_url": "https://api.github.com/users/Elyspio/orgs",
						"repos_url": "https://api.github.com/users/Elyspio/repos",
						"events_url": "https://api.github.com/users/Elyspio/events{/privacy}",
						"received_events_url": "https://api.github.com/users/Elyspio/received_events",
						"type": "User",
						"site_admin": false
					},
					"html_url": "https://github.com/Elyspio/automatize-github-docker",
					"description": "A tool which help use of webhook on github and dockerhub platforms",
					"fork": false,
					"url": "https://github.com/Elyspio/automatize-github-docker",
					"forks_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/forks",
					"keys_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/keys{/key_id}",
					"collaborators_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/collaborators{/collaborator}",
					"teams_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/teams",
					"hooks_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/hooks",
					"issue_events_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/issues/events{/number}",
					"events_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/events",
					"assignees_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/assignees{/user}",
					"branches_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/branches{/branch}",
					"tags_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/tags",
					"blobs_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/git/blobs{/sha}",
					"git_tags_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/git/tags{/sha}",
					"git_refs_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/git/refs{/sha}",
					"trees_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/git/trees{/sha}",
					"statuses_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/statuses/{sha}",
					"languages_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/languages",
					"stargazers_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/stargazers",
					"contributors_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/contributors",
					"subscribers_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/subscribers",
					"subscription_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/subscription",
					"commits_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/commits{/sha}",
					"git_commits_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/git/commits{/sha}",
					"comments_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/comments{/number}",
					"issue_comment_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/issues/comments{/number}",
					"contents_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/contents/{+path}",
					"compare_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/compare/{base}...{head}",
					"merges_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/merges",
					"archive_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/{archive_format}{/ref}",
					"downloads_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/downloads",
					"issues_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/issues{/number}",
					"pulls_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/pulls{/number}",
					"milestones_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/milestones{/number}",
					"notifications_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/notifications{?since,all,participating}",
					"labels_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/labels{/name}",
					"releases_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/releases{/id}",
					"deployments_url": "https://api.github.com/repos/Elyspio/automatize-github-docker/deployments",
					"created_at": 1612427704,
					"updated_at": "2021-03-06T16:05:45.000Z",
					"pushed_at": 1615117745,
					"git_url": "git://github.com/Elyspio/automatize-github-docker.git",
					"ssh_url": "git@github.com:Elyspio/automatize-github-docker.git",
					"clone_url": "https://github.com/Elyspio/automatize-github-docker.git",
					"svn_url": "https://github.com/Elyspio/automatize-github-docker",
					"homepage": {},
					"size": 439,
					"stargazers_count": 0,
					"watchers_count": 0,
					"language": "TypeScript",
					"has_issues": true,
					"has_projects": true,
					"has_downloads": true,
					"has_wiki": true,
					"has_pages": false,
					"forks_count": 0,
					"mirror_url": {},
					"archived": false,
					"disabled": false,
					"open_issues_count": 0,
					"license": null,
					"forks": 0,
					"open_issues": 0,
					"watchers": 0,
					"default_branch": "master",
					"stargazers": 0,
					"master_branch": "master"
				},
				"pusher": {
					"name": "Elyspio",
					"email": "jona.guich69@gmail.com"
				},
				"sender": {
					"name": "Elyspio",
					"email": "jona.guich69@gmail.com",
					"login": "Elyspio",
					"id": 22132082,
					"node_id": "MDQ6VXNlcjIyMTMyMDgy",
					"avatar_url": "https://avatars.githubusercontent.com/u/22132082?v=4",
					"gravatar_id": "",
					"url": "https://api.github.com/users/Elyspio",
					"html_url": "https://github.com/Elyspio",
					"followers_url": "https://api.github.com/users/Elyspio/followers",
					"following_url": "https://api.github.com/users/Elyspio/following{/other_user}",
					"gists_url": "https://api.github.com/users/Elyspio/gists{/gist_id}",
					"starred_url": "https://api.github.com/users/Elyspio/starred{/owner}{/repo}",
					"subscriptions_url": "https://api.github.com/users/Elyspio/subscriptions",
					"organizations_url": "https://api.github.com/users/Elyspio/orgs",
					"repos_url": "https://api.github.com/users/Elyspio/repos",
					"events_url": "https://api.github.com/users/Elyspio/events{/privacy}",
					"received_events_url": "https://api.github.com/users/Elyspio/received_events",
					"type": "User",
					"site_admin": false
				}
			};
			const ret = await new Apis.GithubWebhooksApi(undefined, "http://localhost:" + port).githubWebhooksPush(data);
			expect(ret.status).toEqual(204);
		}, 60000);
	});

});
