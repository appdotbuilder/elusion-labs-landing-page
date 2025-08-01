
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { communityStatsTable } from '../db/schema';
import { getCommunityStats } from '../handlers/get_community_stats';

describe('getCommunityStats', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should get the most recent community stats', async () => {
    // Create test community stats
    await db.insert(communityStatsTable)
      .values({
        github_stars: 156,
        total_downloads: 2543,
        contributors: 8,
        repositories: 3
      })
      .execute();

    const result = await getCommunityStats();

    expect(result.github_stars).toEqual(156);
    expect(result.total_downloads).toEqual(2543);
    expect(result.contributors).toEqual(8);
    expect(result.repositories).toEqual(3);
    expect(result.id).toBeDefined();
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should return the most recent stats when multiple exist', async () => {
    // Create older stats
    await db.insert(communityStatsTable)
      .values({
        github_stars: 100,
        total_downloads: 1000,
        contributors: 5,
        repositories: 2
      })
      .execute();

    // Wait a moment to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    // Create newer stats
    await db.insert(communityStatsTable)
      .values({
        github_stars: 200,
        total_downloads: 3000,
        contributors: 10,
        repositories: 4
      })
      .execute();

    const result = await getCommunityStats();

    // Should return the newer stats
    expect(result.github_stars).toEqual(200);
    expect(result.total_downloads).toEqual(3000);
    expect(result.contributors).toEqual(10);
    expect(result.repositories).toEqual(4);
  });

  it('should throw error when no community stats exist', async () => {
    expect(getCommunityStats()).rejects.toThrow(/no community stats found/i);
  });
});
