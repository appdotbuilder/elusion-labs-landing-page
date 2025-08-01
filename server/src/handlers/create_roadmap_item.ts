
import { db } from '../db';
import { roadmapItemsTable } from '../db/schema';
import { type CreateRoadmapItemInput, type RoadmapItem } from '../schema';

export const createRoadmapItem = async (input: CreateRoadmapItemInput): Promise<RoadmapItem> => {
  try {
    // Insert roadmap item record
    const result = await db.insert(roadmapItemsTable)
      .values({
        title: input.title,
        description: input.description,
        status: input.status, // Already has default from Zod schema
        expected_date: input.expected_date || null,
        priority: input.priority // Already has default from Zod schema
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Roadmap item creation failed:', error);
    throw error;
  }
};
