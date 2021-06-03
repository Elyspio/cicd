import {Nullable, Property, Required} from "@tsed/schema";

export class Pusher {
	@Property()
	@Required()
	name: string;
	@Property()
	@Required()
	email: string;
}

export class User {
	@Property()
	@Required()
	name?: string;

	@Property()
	@Required()
	email?: string;

	@Property()
	@Required()
	login: string;

	@Property()
	@Required()
	id: number;

	@Property()
	@Required()
	node_id: string;

	@Property()
	@Required()
	avatar_url: string;

	@Required()
	@Property()
	gravatar_id: string;

	@Property()
	@Required()
	url: string;

	@Property()
	@Required()
	html_url: string;

	@Property()
	@Required()
	followers_url: string;

	@Property()
	@Required()
	following_url: string;

	@Property()
	@Required()
	gists_url: string;

	@Property()
	@Required()
	starred_url: string;

	@Property()
	@Required()
	subscriptions_url: string;

	@Property()
	@Required()
	organizations_url: string;

	@Property()
	@Required()
	repos_url: string;

	@Property()
	@Required()
	events_url: string;

	@Property()
	@Required()
	received_events_url: string;

	@Property()
	@Required()
	type: string;

	@Property()
	@Required()
	site_admin: boolean;
}

export class Repository {
	@Property()
	@Required()
	id: number;

	@Property()
	@Required()
	node_id: string;

	@Required()
	@Property()
	name: string;

	@Property()
	@Required()
	full_name: string;

	@Property()
	@Required()
	private: boolean;

	@Property(User)
	@Required()
	owner: User;

	@Property()
	@Required()
	html_url: string;

	@Nullable(String)
	@Required()
	description: null | string;

	@Required()
	@Property()
	fork: boolean;

	@Required()
	@Property()
	url: string;

	@Property()
	@Required()
	forks_url: string;

	@Property()
	@Required()
	keys_url: string;

	@Property()
	@Required()
	collaborators_url: string;

	@Property()
	@Required()
	teams_url: string;

	@Property()
	@Required()
	hooks_url: string;

	@Property()
	@Required()
	issue_events_url: string;

	@Property()
	@Required()
	events_url: string;

	@Property()
	@Required()
	assignees_url: string;

	@Required()
	@Property()
	branches_url: string;

	@Property()
	@Required()
	tags_url: string;

	@Property()
	@Required()
	blobs_url: string;

	@Property()
	@Required()
	git_tags_url: string;

	@Property()
	@Required()
	git_refs_url: string;

	@Property()
	@Required()
	trees_url: string;

	@Property()
	@Required()
	statuses_url: string;

	@Property()
	@Required()
	languages_url: string;

	@Property()
	@Required()
	stargazers_url: string;

	@Property()
	@Required()
	contributors_url: string;

	@Property()
	@Required()
	subscribers_url: string;

	@Property()
	@Required()
	subscription_url: string;

	@Property()
	@Required()
	commits_url: string;

	@Property()
	@Required()
	git_commits_url: string;

	@Property()
	@Required()
	comments_url: string;

	@Property()
	@Required()
	issue_comment_url: string;

	@Property()
	@Required()
	contents_url: string;

	@Property()
	@Required()
	compare_url: string;

	@Property()
	@Required()
	merges_url: string;

	@Property()
	@Required()
	archive_url: string;

	@Property()
	@Required()
	downloads_url: string;

	@Property()
	@Required()
	issues_url: string;

	@Property()
	@Required()
	pulls_url: string;

	@Property()
	@Required()
	milestones_url: string;

	@Property()
	@Required()
	notifications_url: string;

	@Property()
	labels_url: string;
	@Required()

	@Property()
	@Required()
	releases_url: string;

	@Property()
	@Required()
	deployments_url: string;

	@Property()
	@Required()
	created_at: number;

	@Property(Date)
	@Required()
	updated_at: Date;

	@Property()
	@Required()
	pushed_at: number;

	@Property()
	@Required()
	git_url: string;

	@Property()
	@Required()
	ssh_url: string;

	@Property()
	@Required()
	clone_url: string;

	@Property()
	@Required()
	svn_url: string;

	@Property()
	@Required()
	homepage: null | string;

	@Property()
	@Required()
	size: number;

	@Property()
	@Required()
	stargazers_count: number;

	@Property()
	@Required()
	watchers_count: number;

	@Property()
	@Required()
	language: string;
	@Property()
	@Required()
	has_issues: boolean;

	@Property()
	@Required()
	has_projects: boolean;

	@Property()
	@Required()
	has_downloads: boolean;

	@Property()
	@Required()
	has_wiki: boolean;

	@Property()
	@Required()
	has_pages: boolean;

	@Property()
	@Required()
	forks_count: number;

	@Property()
	@Required()
	mirror_url: null | string;

	@Property()
	@Required()
	archived: boolean;

	@Property()
	@Required()
	disabled: boolean;

	@Property()
	@Required()
	open_issues_count: number;

	@Nullable(String)
	@Required()
	license: null | string;

	@Property()
	@Required()
	forks: number;

	@Property()
	@Required()
	open_issues: number;

	@Property()
	@Required()
	watchers: number;

	@Property()
	@Required()
	default_branch: string;

	@Property()
	@Required()
	stargazers: number;

	@Property()
	@Required()
	master_branch: string;
}


export class GithubPushWebhook {

	@Property()
	@Required()
	ref: string;

	@Property()
	@Required()
	before: string;

	@Property()
	@Required()
	after: string;

	@Property()
	@Required()
	created: boolean;

	@Property()
	@Required()
	deleted: boolean;

	@Property()
	@Required()
	forced: boolean;

	@Property()
	@Required()
	base_ref: string;

	@Property()
	@Required()
	compare: string;

	@Property(String)
	@Required()
	commits: string[];

	@Property(String)
	head_commit: null | string;

	@Property(Repository)
	@Required()
	repository: Repository;

	@Property(Pusher)
	@Required()
	pusher: Pusher;

	@Property(User)
	@Required()
	sender: User;
}


export class FileModel {

	@Property(String)
	@Required()
	path: string

	@Property(String)
	@Required()
	key: string

	@Property(Number)
	@Required()
	size: number
}

export class RepoWithBranchModel {

	@Property(String)
	@Required()
	branch: string

	@Property(String)
	@Required()
	repo: string
}
