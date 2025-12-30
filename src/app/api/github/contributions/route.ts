/* ###########################################################
   ###   ANTONY O'NEILL - PORTFOLIO                         ###
   ###   GITHUB CONTRIBUTIONS API - Fetches contribution    ###
   ###   data via GitHub GraphQL API                        ###
   ###   Last Updated: 30-12-2024                           ###
   ########################################################### */

import { NextResponse } from 'next/server';

/* ###########################################################
   ###   1. Configuration                                   ###
   ########################################################### */

const GITHUB_USERNAME = 'W17ant';
const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';

/* ###########################################################
   ###   2. GraphQL Query                                   ###
   ########################################################### */

const CONTRIBUTIONS_QUERY = `
  query($username: String!) {
    user(login: $username) {
      contributionsCollection {
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

export async function GET() {
  const token = process.env.GITHUB_TOKEN;

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
        variables: { username: GITHUB_USERNAME },
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
