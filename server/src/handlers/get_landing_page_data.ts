
import { db } from '../db';
import { 
  heroSectionsTable, 
  sdkShowcasesTable, 
  sdkFeaturesTable, 
  codeComparisonsTable, 
  communityStatsTable, 
  roadmapItemsTable 
} from '../db/schema';
import { type LandingPageData } from '../schema';
import { eq } from 'drizzle-orm';

export async function getLandingPageData(): Promise<LandingPageData> {
  try {
    // Fetch hero section (get the first/latest one)
    const heroResults = await db.select()
      .from(heroSectionsTable)
      .orderBy(heroSectionsTable.created_at)
      .limit(1)
      .execute();

    // Fetch featured SDKs
    const featuredSdks = await db.select()
      .from(sdkShowcasesTable)
      .where(eq(sdkShowcasesTable.is_featured, true))
      .execute();

    // Fetch all SDK features for featured SDKs
    const sdkFeatures = featuredSdks.length > 0 
      ? await db.select()
          .from(sdkFeaturesTable)
          .execute()
      : [];

    // Fetch code comparisons
    const codeComparisons = await db.select()
      .from(codeComparisonsTable)
      .execute();

    // Fetch community stats (get the latest one)
    const communityStatsResults = await db.select()
      .from(communityStatsTable)
      .orderBy(communityStatsTable.updated_at)
      .limit(1)
      .execute();

    // Fetch roadmap items
    const roadmapItems = await db.select()
      .from(roadmapItemsTable)
      .execute();

    // Handle case where no hero section exists - throw error as it's required
    if (heroResults.length === 0) {
      throw new Error('No hero section found');
    }

    // Handle case where no community stats exist - throw error as it's required
    if (communityStatsResults.length === 0) {
      throw new Error('No community stats found');
    }

    return {
      hero: heroResults[0],
      featured_sdks: featuredSdks,
      sdk_features: sdkFeatures,
      code_comparisons: codeComparisons,
      community_stats: communityStatsResults[0],
      roadmap: roadmapItems
    };
  } catch (error) {
    console.error('Failed to fetch landing page data:', error);
    throw error;
  }
}
