
import { db } from '../db';
import { heroSectionsTable } from '../db/schema';
import { type HeroSection } from '../schema';
import { desc } from 'drizzle-orm';

export const getHeroSection = async (): Promise<HeroSection | null> => {
  try {
    // Get the most recent hero section
    const results = await db.select()
      .from(heroSectionsTable)
      .orderBy(desc(heroSectionsTable.updated_at))
      .limit(1)
      .execute();

    if (results.length === 0) {
      return null;
    }

    return results[0];
  } catch (error) {
    console.error('Failed to get hero section:', error);
    throw error;
  }
};
