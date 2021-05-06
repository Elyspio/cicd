export const githubToken = process.env.GITHUB_TOKEN
if (githubToken === undefined) throw new Error("env.GITHUB_TOKEN must be filled")
