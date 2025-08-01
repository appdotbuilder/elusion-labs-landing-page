
import { db } from '../db';
import { communityStatsTable } from '../db/schema';
import { desc } from 'drizzle-orm';
import { type CommunityStats } from '../schema';

export const getCommunityStats = async (): Promise<CommunityStats> => {
  try {
    // Get the most recent community stats record
    const results = await db.select()
      .from(communityStatsTable)
      .orderBy(desc(communityStatsTable.updated_at))
      .limit(1)
      .execute();

    if (results.length === 0) {
      throw new Error('No community stats found');
    }

    return results[0];
  } catch (error) {
    console.error('Failed to get community stats:', error);
    throw error;
  }
};
