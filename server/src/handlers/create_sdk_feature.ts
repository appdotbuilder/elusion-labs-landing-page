
import { db } from '../db';
import { sdkFeaturesTable, sdkShowcasesTable } from '../db/schema';
import { type CreateSdkFeatureInput, type SdkFeature } from '../schema';
import { eq } from 'drizzle-orm';

export const createSdkFeature = async (input: CreateSdkFeatureInput): Promise<SdkFeature> => {
  try {
    // Verify that the referenced SDK exists to prevent foreign key constraint violation
    const existingSdk = await db.select()
      .from(sdkShowcasesTable)
      .where(eq(sdkShowcasesTable.id, input.sdk_id))
      .execute();

    if (existingSdk.length === 0) {
      throw new Error(`SDK with id ${input.sdk_id} not found`);
    }

    // Insert SDK feature record
    const result = await db.insert(sdkFeaturesTable)
      .values({
        sdk_id: input.sdk_id,
        name: input.name,
        description: input.description,
        icon: input.icon || null
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('SDK feature creation failed:', error);
    throw error;
  }
};
