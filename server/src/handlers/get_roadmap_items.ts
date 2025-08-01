
import { db } from '../db';
import { roadmapItemsTable } from '../db/schema';
import { type RoadmapItem } from '../schema';
import { asc, desc } from 'drizzle-orm';

export const getRoadmapItems = async (): Promise<RoadmapItem[]> => {
  try {
    // Fetch all roadmap items ordered by priority (ascending) and then by status
    // This ensures high priority items come first, and within same priority,
    // they're ordered by status (completed, in_progress, planned)
    const results = await db.select()
      .from(roadmapItemsTable)
      .orderBy(
        asc(roadmapItemsTable.priority),
        desc(roadmapItemsTable.status),
        asc(roadmapItemsTable.created_at)
      )
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch roadmap items:', error);
    throw error;
  }
};
