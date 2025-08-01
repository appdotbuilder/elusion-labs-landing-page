
import { db } from '../db';
import { sdkShowcasesTable } from '../db/schema';
import { eq, desc } from 'drizzle-orm';
import { type SdkShowcase } from '../schema';

export const getFeaturedSdks = async (): Promise<SdkShowcase[]> => {
  try {
    const results = await db.select()
      .from(sdkShowcasesTable)
      .where(eq(sdkShowcasesTable.is_featured, true))
      .orderBy(desc(sdkShowcasesTable.created_at))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch featured SDKs:', error);
    throw error;
  }
};
