/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   GITHUB ACTIVITY - Recent commits/activity widget   ###
   ###   Fetches and displays recent GitHub activity        ###
   ###   Last Updated: 30-12-2024                           ###
   ########################################################### */

'use client';

import { useState, useEffect } from 'react';
import { GitCommit, GitBranch, Star, GitFork, ExternalLink } from 'lucide-react';

/* ###########################################################
   ###   1. Type Definitions                                ###
   ########################################################### */

interface GitHubEvent {
  id: string;
  type: string;
  repo: {
    name: string;
    url: string;
  };
  created_at: string;
  payload: {
    commits?: Array<{
      sha: string;
      message: string;
    }>;
    ref?: string;
    ref_type?: string;
    action?: string;
  };
}

interface RepoInfo {
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  updated_at: string;
}

/* ###########################################################
   ###   2. Configuration                                   ###
   ########################################################### */

const GITHUB_USERNAME = 'W17ant';
const MAX_EVENTS = 5;
const MAX_REPOS = 3;

/* ###########################################################
   ###   3. Component                                       ###
   ########################################################### */

export default function GitHubActivity() {
  const [events, setEvents] = useState<GitHubEvent[]>([]);
  const [repos, setRepos] = useState<RepoInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'activity' | 'repos'>('activity');

  useEffect(() => {
    async function fetchGitHubData() {
      try {
        setLoading(true);
        setError(null);

        // Fetch recent events and repos in parallel
        const [eventsRes, reposRes] = await Promise.all([
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=30`),
          fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=10`),
        ]);

        if (!eventsRes.ok || !reposRes.ok) {
          throw new Error('Failed to fetch GitHub data');
        }

        const eventsData = await eventsRes.json();
        const reposData = await reposRes.json();

        // Filter for meaningful events (pushes, creates, stars)
        const filteredEvents = eventsData
          .filter((e: GitHubEvent) =>
            ['PushEvent', 'CreateEvent', 'WatchEvent', 'ForkEvent'].includes(e.type)
          )
          .slice(0, MAX_EVENTS);

        // Get top repos by recent activity
        const topRepos = reposData
          .filter((r: RepoInfo) => !r.name.includes('.github'))
          .slice(0, MAX_REPOS);

        setEvents(filteredEvents);
        setRepos(topRepos);
      } catch (err) {
        setError('Unable to load GitHub activity');
        console.error('GitHub API error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubData();
  }, []);

  /* ###########################################################
     ###   Helper Functions                                   ###
     ########################################################### */

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'PushEvent':
        return <GitCommit size={14} />;
      case 'CreateEvent':
        return <GitBranch size={14} />;
      case 'WatchEvent':
        return <Star size={14} />;
      case 'ForkEvent':
        return <GitFork size={14} />;
      default:
        return <GitCommit size={14} />;
    }
  };

  const getEventDescription = (event: GitHubEvent): string => {
    const repoName = event.repo.name.split('/')[1];
    switch (event.type) {
      case 'PushEvent':
        const commitCount = event.payload.commits?.length || 0;
        const commitMsg = event.payload.commits?.[0]?.message?.split('\n')[0] || '';
        return commitCount > 1
          ? `${commitCount} commits to ${repoName}`
          : commitMsg.length > 40
            ? `${commitMsg.slice(0, 40)}...`
            : commitMsg || `Push to ${repoName}`;
      case 'CreateEvent':
        return `Created ${event.payload.ref_type} ${event.payload.ref || ''} in ${repoName}`;
      case 'WatchEvent':
        return `Starred ${repoName}`;
      case 'ForkEvent':
        return `Forked ${repoName}`;
      default:
        return `Activity in ${repoName}`;
    }
  };

  const getLanguageColor = (language: string): string => {
    const colors: Record<string, string> = {
      TypeScript: '#3178c6',
      JavaScript: '#f7df1e',
      Python: '#3572A5',
      HTML: '#e34c26',
      CSS: '#563d7c',
      Rust: '#dea584',
      Go: '#00ADD8',
    };
    return colors[language] || '#8b8b8b';
  };

  /* ###########################################################
     ###   Render                                             ###
     ########################################################### */

  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
          <div className="h-5 w-32 bg-white/10 rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-white/5 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-2">
          <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" style={{ color: 'var(--ink)' }}>
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          <span className="font-semibold" style={{ color: 'var(--ink)' }}>GitHub Activity</span>
        </div>
        <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor" style={{ color: 'var(--ink)' }}>
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span className="font-semibold" style={{ color: 'var(--ink)' }}>GitHub</span>
          </div>
          <a
            href={`https://github.com/${GITHUB_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-medium transition-colors hover:opacity-80"
            style={{ color: 'var(--link)' }}
          >
            @{GITHUB_USERNAME}
            <ExternalLink size={12} />
          </a>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mt-3">
          <button
            onClick={() => setActiveTab('activity')}
            className={`text-xs font-medium pb-1 border-b-2 transition-colors ${
              activeTab === 'activity'
                ? 'border-current'
                : 'border-transparent opacity-60 hover:opacity-80'
            }`}
            style={{ color: activeTab === 'activity' ? 'var(--link)' : 'var(--ink-secondary)' }}
          >
            Recent Activity
          </button>
          <button
            onClick={() => setActiveTab('repos')}
            className={`text-xs font-medium pb-1 border-b-2 transition-colors ${
              activeTab === 'repos'
                ? 'border-current'
                : 'border-transparent opacity-60 hover:opacity-80'
            }`}
            style={{ color: activeTab === 'repos' ? 'var(--link)' : 'var(--ink-secondary)' }}
          >
            Repositories
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'activity' ? (
          <div className="space-y-3">
            {events.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>No recent activity</p>
            ) : (
              events.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 text-sm"
                >
                  <div
                    className="mt-0.5 p-1.5 rounded-md"
                    style={{ background: 'var(--accent-bg)', color: 'var(--accent)' }}
                  >
                    {getEventIcon(event.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="truncate"
                      style={{ color: 'var(--ink)' }}
                      title={getEventDescription(event)}
                    >
                      {getEventDescription(event)}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--ink-muted)' }}>
                      {formatTimeAgo(event.created_at)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {repos.map((repo) => (
              <a
                key={repo.name}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-lg transition-colors hover:bg-[var(--bg-surface)]"
                style={{ background: 'var(--bg-base)' }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm" style={{ color: 'var(--link)' }}>
                    {repo.name}
                  </span>
                  <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--ink-muted)' }}>
                    {repo.stargazers_count > 0 && (
                      <span className="flex items-center gap-1">
                        <Star size={12} />
                        {repo.stargazers_count}
                      </span>
                    )}
                    {repo.forks_count > 0 && (
                      <span className="flex items-center gap-1">
                        <GitFork size={12} />
                        {repo.forks_count}
                      </span>
                    )}
                  </div>
                </div>
                {repo.description && (
                  <p
                    className="text-xs truncate mb-2"
                    style={{ color: 'var(--ink-secondary)' }}
                  >
                    {repo.description}
                  </p>
                )}
                {repo.language && (
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--ink-muted)' }}>
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: getLanguageColor(repo.language) }}
                    />
                    {repo.language}
                  </div>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ###########################################################
   ###           END OF GITHUB ACTIVITY                     ###
   ########################################################### */
