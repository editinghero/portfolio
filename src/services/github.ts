import { GitHubRepo, GitHubUser } from '../types/github'

const GITHUB_USERNAME = 'editinghero'

export async function fetchGitHubUser(): Promise<GitHubUser> {
  const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub user: ${response.status}`)
  }

  return response.json()
}

export async function fetchGitHubRepos(): Promise<GitHubRepo[]> {
  const response = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
    {
      headers: {
        Accept: 'application/vnd.github.v3+json',
      },
    }
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub repos: ${response.status}`)
  }

  const repos = await response.json()
  return repos.filter((repo: GitHubRepo) => !repo.name.includes('fork'))
}
