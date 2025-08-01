
import { db } from '../db';
import { communityStatsTable } from '../db/schema';
import { type UpdateCommunityStatsInput, type CommunityStats } from '../schema';
import { eq } from 'drizzle-orm';

export async function updateCommunityStats(input: UpdateCommunityStatsInput): Promise<CommunityStats> {
  try {
    // First, try to get existing stats
    const existing = await db.select()
      .from(communityStatsTable)
      .limit(1)
      .execute();

    if (existing.length > 0) {
      // Update existing record
      const existingStats = existing[0];
      const updateData: any = {
        updated_at: new Date()
      };

      // Only update fields that are provided
      if (input.github_stars !== undefined) {
        updateData.github_stars = input.github_stars;
      }
      if (input.total_downloads !== undefined) {
        updateData.total_downloads = input.total_downloads;
      }
      if (input.contributors !== undefined) {
        updateData.contributors = input.contributors;
      }
      if (input.repositories !== undefined) {
        updateData.repositories = input.repositories;
      }

      const result = await db.update(communityStatsTable)
        .set(updateData)
        .where(eq(communityStatsTable.id, existingStats.id))
        .returning()
        .execute();

      return result[0];
    } else {
      // Create new record with default values for missing fields
      const result = await db.insert(communityStatsTable)
        .values({
          github_stars: input.github_stars ?? 0,
          total_downloads: input.total_downloads ?? 0,
          contributors: input.contributors ?? 0,
          repositories: input.repositories ?? 0
        })
        .returning()
        .execute();

      return result[0];
    }
  } catch (error) {
    console.error('Community stats update failed:', error);
    throw error;
  }
}
