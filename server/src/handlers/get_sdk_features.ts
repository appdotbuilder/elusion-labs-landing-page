
import { db } from '../db';
import { sdkFeaturesTable } from '../db/schema';
import { type SdkFeature } from '../schema';
import { eq } from 'drizzle-orm';

export const getSdkFeatures = async (sdkId: number): Promise<SdkFeature[]> => {
  try {
    const results = await db.select()
      .from(sdkFeaturesTable)
      .where(eq(sdkFeaturesTable.sdk_id, sdkId))
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to get SDK features:', error);
    throw error;
  }
};
