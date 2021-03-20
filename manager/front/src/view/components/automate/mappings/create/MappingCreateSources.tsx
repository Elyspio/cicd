import React from "react";
import {Container, FormControl, InputLabel, MenuItem, Select, Typography} from "@material-ui/core";
import {ReactComponent as GithubIcon} from "../../icons/github.svg";
import {ReactComponent as GitBranchIcon} from "../../icons/git-branch.svg";
import {Apis} from "../../../../../core/apis";
import {connect, ConnectedProps} from "react-redux";
import {Dispatch} from "redux";
import {StoreState} from "../../../../store";
import {automationActions} from "../../../../store/module/job/jobSplice";
import {usePrevious} from "../../../../hooks/usePrevious";


const mapStateToProps = (state: StoreState) => ({})

const mapDispatchToProps = (dispatch: Dispatch) => ({
    updateSources: (conf: StoreState["automation"]["sources"]) => dispatch(automationActions.updateSources(conf))
})

const connector = connect(mapStateToProps, mapDispatchToProps);
type ReduxTypes = ConnectedProps<typeof connector>;


type Props = ReduxTypes & {};

function MappingCreateSources(props: Props) {


    const [username, setUsername] = React.useState<string | undefined>()
    const [branch, setBranch] = React.useState<string | undefined>()
    const [repository, setRepo] = React.useState<string | undefined>()
    const [repos, setRepos] = React.useState(Array<string>())
    const [branches, setBranches] = React.useState(Array<string>())

    // region reflect on store

    const previous = usePrevious(repository);


    React.useEffect(() => {
        if (repository !== previous) setBranch(branches[0])
        props.updateSources({repository, branch, username})
    }, [repository, repos, username, previous, props.updateSources, branch])



    // endregion

    // region fetch

    React.useEffect(() => {
        (async () => {
            const {data: username} = await Apis.core.github.githubGetUsernameFromCookies()
            setUsername(username);
        })()
    }, [    ])


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
        if (repository && username) {
            (async () => {
                const {data: branches} = await Apis.core.github.githubGetBranchesForRepository(username, repository)
                setBranches(branches);
                setBranch(branches[0])
            })()
        }
    }, [repository, username])

    // endregion

    const size = 16

    const onRepoChange = (e) => {
        setRepo(e.target.value as string);
    };

    const onBranchChange = (e) => {
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
                    value={repository ?? ""}
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

export default connector(MappingCreateSources)
