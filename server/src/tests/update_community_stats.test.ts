
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { communityStatsTable } from '../db/schema';
import { type UpdateCommunityStatsInput } from '../schema';
import { updateCommunityStats } from '../handlers/update_community_stats';
import { eq } from 'drizzle-orm';

const testInput: UpdateCommunityStatsInput = {
  github_stars: 1500,
  total_downloads: 50000,
  contributors: 25,
  repositories: 10
};

describe('updateCommunityStats', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create new community stats when none exist', async () => {
    const result = await updateCommunityStats(testInput);

    expect(result.github_stars).toEqual(1500);
    expect(result.total_downloads).toEqual(50000);
    expect(result.contributors).toEqual(25);
    expect(result.repositories).toEqual(10);
    expect(result.id).toBeDefined();
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should update existing community stats', async () => {
    // Create initial stats
    await db.insert(communityStatsTable)
      .values({
        github_stars: 1000,
        total_downloads: 30000,
        contributors: 20,
        repositories: 8
      })
      .execute();

    // Update with new values
    const updateInput: UpdateCommunityStatsInput = {
      github_stars: 2000,
      total_downloads: 75000
    };

    const result = await updateCommunityStats(updateInput);

    expect(result.github_stars).toEqual(2000);
    expect(result.total_downloads).toEqual(75000);
    expect(result.contributors).toEqual(20); // Should remain unchanged
    expect(result.repositories).toEqual(8); // Should remain unchanged
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should partially update community stats', async () => {
    // Create initial stats
    await db.insert(communityStatsTable)
      .values({
        github_stars: 500,
        total_downloads: 10000,
        contributors: 15,
        repositories: 5
      })
      .execute();

    // Update only github_stars
    const partialInput: UpdateCommunityStatsInput = {
      github_stars: 750
    };

    const result = await updateCommunityStats(partialInput);

    expect(result.github_stars).toEqual(750);
    expect(result.total_downloads).toEqual(10000); // Unchanged
    expect(result.contributors).toEqual(15); // Unchanged
    expect(result.repositories).toEqual(5); // Unchanged
  });

  it('should save updated stats to database', async () => {
    const result = await updateCommunityStats(testInput);

    const stats = await db.select()
      .from(communityStatsTable)
      .where(eq(communityStatsTable.id, result.id))
      .execute();

    expect(stats).toHaveLength(1);
    expect(stats[0].github_stars).toEqual(1500);
    expect(stats[0].total_downloads).toEqual(50000);
    expect(stats[0].contributors).toEqual(25);
    expect(stats[0].repositories).toEqual(10);
    expect(stats[0].updated_at).toBeInstanceOf(Date);
  });

  it('should handle zero values correctly', async () => {
    const zeroInput: UpdateCommunityStatsInput = {
      github_stars: 0,
      total_downloads: 0,
      contributors: 0,
      repositories: 0
    };

    const result = await updateCommunityStats(zeroInput);

    expect(result.github_stars).toEqual(0);
    expect(result.total_downloads).toEqual(0);
    expect(result.contributors).toEqual(0);
    expect(result.repositories).toEqual(0);
  });

  it('should update timestamp on each update', async () => {
    // Create initial stats
    const first = await updateCommunityStats({ github_stars: 100 });

    // Wait a bit to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    // Update again
    const result = await updateCommunityStats({ total_downloads: 5000 });

    expect(result.updated_at).toBeInstanceOf(Date);
    expect(result.updated_at.getTime()).toBeGreaterThan(first.updated_at.getTime());
    
    // Verify the updated_at was actually updated
    const stats = await db.select()
      .from(communityStatsTable)
      .where(eq(communityStatsTable.id, result.id))
      .execute();

    expect(stats[0].updated_at).toBeInstanceOf(Date);
    expect(stats[0].updated_at.getTime()).toBeGreaterThan(first.updated_at.getTime());
  });

  it('should handle empty input gracefully', async () => {
    // Create initial stats
    await db.insert(communityStatsTable)
      .values({
        github_stars: 1000,
        total_downloads: 30000,
        contributors: 20,
        repositories: 8
      })
      .execute();

    // Update with empty input
    const emptyInput: UpdateCommunityStatsInput = {};

    const result = await updateCommunityStats(emptyInput);

    // All values should remain the same except updated_at
    expect(result.github_stars).toEqual(1000);
    expect(result.total_downloads).toEqual(30000);
    expect(result.contributors).toEqual(20);
    expect(result.repositories).toEqual(8);
    expect(result.updated_at).toBeInstanceOf(Date);
  });
});
