import React from "react";
import {Container, FormControl, InputLabel, MenuItem, Select, Typography} from "@material-ui/core";
import {ReactComponent as GithubIcon} from "../../icons/github.svg";
import {ReactComponent as GitBranchIcon} from "../../icons/git-branch.svg";
import {Apis} from "../../../../../core/apis";


type Props = {
    onChanges: {
        repo: (repo: string) => void,
        branch: (branch: string) => void,
        username: (name: string) => void
    }
};

export function MappingCreateSources(props: Props) {


    const [username, setUsername] = React.useState<string | undefined>()
    const [branch, setBranch] = React.useState<string | undefined>()
    const [repo, setRepo] = React.useState<string | undefined>()
    const [repos, setRepos] = React.useState(Array<string>())
    const [branches, setBranches] = React.useState(Array<string>())

    React.useEffect(() => {
        (async () => {
            const {data: username} = await Apis.core.github.githubGetUsernameFromCookies()
            setUsername(username);
            props.onChanges.username(username)
        })()
    }, [])

    React.useEffect(() => {
        if (username) {
            (async () => {
                const {data: repos} = await Apis.core.github.githubGetRepositories(username)
                setRepos(repos);
                setRepo(repos[0]);
            })()
        }
    }, [username])

    React.useEffect(() => {
        if (repo && username) {
            (async () => {
                const {data: branches} = await Apis.core.github.githubGetBranchesForRepository(username, repo)
                setBranches(branches);
                setBranch(branches[0])
            })()
        }
    }, [repo])

    const size = 16

    const onRepoChange = (e) => {
        props.onChanges.repo(e.target.value as string)
        setRepo(e.target.value as string);
    };

    const onBranchChange = (e) => {
        props.onChanges.branch(e.target.value as string)
        setBranch(e.target.value as string);
    };


    return <div className="MappingCreateSources">

        <Container className={"Container"}>
            <Typography variant={"h6"}>Github (Sources)</Typography>
            <FormControl className={"FormControl"}>
                <InputLabel id="mapping-create-repository-label">Repository</InputLabel>
                <Select
                    labelId="mapping-create-repository-label"
                    id="mapping-create-repository-input"
                    value={repo ?? ""}
                    required
                    onChange={onRepoChange}
                    renderValue={(value) => <div><GithubIcon width={size} height={size}/> {value}</div>}

                >
                    {repos.map(repo => <MenuItem key={repo} value={repo}>{repo}</MenuItem>)}
                </Select>
            </FormControl>

            <FormControl className={"FormControl"}>
                <InputLabel id="mapping-create-branch-label">Branch</InputLabel>
                <Select
                    labelId="mapping-create-branch-label"
                    id="mapping-create-branch-input"
                    value={branch ?? ""}
                    required
                    onChange={onBranchChange}
                    renderValue={(value) => <div><GitBranchIcon width={size} height={size}/> {value}</div>}
                >
                    {branches.map(branch => <MenuItem key={branch} value={branch}>{branch}</MenuItem>)}
                </Select>
            </FormControl>
        </Container>


    </div>
}

