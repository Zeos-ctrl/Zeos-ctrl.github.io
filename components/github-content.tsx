import { GitHubStats } from "./github-stats"

interface GitHubContentProps {
  username: string
}

export function GitHubContent({ username }: GitHubContentProps) {
  return <GitHubStats username={username} isExpanded={true} />
}
