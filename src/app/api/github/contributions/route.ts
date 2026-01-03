/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   GITHUB CONTRIBUTIONS API - Fetches contribution    ###
   ###   data via GitHub GraphQL API                        ###
   ###   Last Updated: 31-12-2024                           ###
   ########################################################### */

import { NextResponse } from 'next/server';

/* ###########################################################
   ###   1. Configuration                                   ###
   ########################################################### */

const GITHUB_USERNAME = 'W17ANT';
const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';

/* ###########################################################
   ###   2. GraphQL Query                                   ###
   ########################################################### */

const CONTRIBUTIONS_QUERY = `
  query($username: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $username) {
      contributionsCollection(from: $from, to: $to) {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              weekday
            }
          }
        }
      }
    }
  }
`;

/* ###########################################################
   ###   3. Types                                           ###
   ########################################################### */

interface ContributionDay {
  contributionCount: number;
  date: string;
  weekday: number;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface GitHubGraphQLResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          totalContributions: number;
          weeks: ContributionWeek[];
        };
      };
    };
  };
  errors?: Array<{ message: string }>;
}

/* ###########################################################
   ###   4. API Handler                                     ###
   ########################################################### */

export async function GET(request: Request) {
  const token = process.env.GITHUB_TOKEN;
  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

  // Calculate date range for the calendar year
  const from = `${year}-01-01T00:00:00Z`;
  const to = `${year}-12-31T23:59:59Z`;

  if (!token) {
    return NextResponse.json(
      { error: 'GitHub token not configured' },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(GITHUB_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: CONTRIBUTIONS_QUERY,
        variables: { username: GITHUB_USERNAME, from, to },
      }),
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const result: GitHubGraphQLResponse = await response.json();

    if (result.errors) {
      throw new Error(result.errors[0]?.message || 'GraphQL error');
    }

    const calendar = result.data?.user?.contributionsCollection?.contributionCalendar;

    if (!calendar) {
      throw new Error('No contribution data found');
    }

    return NextResponse.json({
      totalContributions: calendar.totalContributions,
      weeks: calendar.weeks,
      year,
    });
  } catch (error) {
    console.error('GitHub contributions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contributions' },
      { status: 500 }
    );
  }
}

/* ###########################################################
   ###           END OF GITHUB CONTRIBUTIONS API            ###
   ########################################################### */
