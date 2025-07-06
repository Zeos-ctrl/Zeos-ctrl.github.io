"use client"

import { useState, useEffect } from "react"
import { Star, GitFork, ExternalLink } from "lucide-react"

interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  watchers_count: number
  language: string | null
  updated_at: string
}

interface GitHubUser {
  login: string
  name: string
  public_repos: number
  followers: number
  following: number
  bio: string | null
}

interface GitHubStatsProps {
  username: string
  isExpanded?: boolean
}

export function GitHubStats({ username, isExpanded = false }: GitHubStatsProps) {
  const [user, setUser] = useState<GitHubUser | null>(null)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true)

        // Fetch user data
        const userResponse = await fetch(`https://api.github.com/users/${username}`)
        if (!userResponse.ok) throw new Error("Failed to fetch user data")
        const userData = await userResponse.json()
        setUser(userData)

        // Fetch repositories
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=6`)
        if (!reposResponse.ok) throw new Error("Failed to fetch repositories")
        const reposData = await reposResponse.json()
        setRepos(reposData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchGitHubData()
  }, [username])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-center">
        <div>
          <p className="text-sm text-red-600 mb-2">Failed to load GitHub data</p>
          <p className="text-xs text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  if (isExpanded) {
    return (
      <div className="space-y-6">
        {/* User Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-2xl font-bold text-black">{user.public_repos}</p>
            <p className="text-sm text-gray-600">Repositories</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-2xl font-bold text-black">{user.followers}</p>
            <p className="text-sm text-gray-600">Followers</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-2xl font-bold text-black">
              {repos.reduce((acc, repo) => acc + repo.stargazers_count, 0)}
            </p>
            <p className="text-sm text-gray-600">Total Stars</p>
          </div>
        </div>

        {/* Top Repositories */}
        <div>
          <h3 className="text-lg font-semibold text-black mb-4">Popular Repositories</h3>
          <div className="grid gap-4">
            {repos.slice(0, 6).map((repo) => (
              <div key={repo.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-black hover:text-blue-600">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        {repo.name}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </h4>
                    {repo.description && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{repo.description}</p>}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {repo.language && (
                      <span className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      {repo.stargazers_count}
                    </span>
                    <span className="flex items-center">
                      <GitFork className="w-4 h-4 mr-1" />
                      {repo.forks_count}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    Updated {new Date(repo.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GitHub Profile Link */}
        <div className="text-center">
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <span>View Full GitHub Profile</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    )
  }

  // Compact view for the main grid
  return (
    <div className="space-y-3 md:space-y-4 flex flex-col justify-center h-full">
      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-sm md:text-lg font-bold text-black">{user.public_repos}</p>
          <p className="text-[10px] md:text-xs text-gray-500">Repos</p>
        </div>
        <div>
          <p className="text-sm md:text-lg font-bold text-black">{user.followers}</p>
          <p className="text-[10px] md:text-xs text-gray-500">Followers</p>
        </div>
        <div>
          <p className="text-sm md:text-lg font-bold text-black">
            {repos.reduce((acc, repo) => acc + repo.stargazers_count, 0)}
          </p>
          <p className="text-[10px] md:text-xs text-gray-500">Stars</p>
        </div>
      </div>

      {/* Top Repos Preview */}
      <div className="space-y-1 md:space-y-2">
        <h4 className="text-xs md:text-sm font-semibold text-black">Top Repositories:</h4>
        {repos.slice(0, 2).map((repo) => (
          <div key={repo.id} className="bg-gray-50 rounded-lg p-2 md:p-3 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-medium text-black truncate">{repo.name}</p>
                {repo.language && <p className="text-[10px] md:text-xs text-gray-500">{repo.language}</p>}
              </div>
              <div className="flex items-center space-x-2 text-[10px] md:text-xs text-gray-500 ml-2">
                <span className="flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  {repo.stargazers_count}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
