
import { db } from '../db';
import { heroSectionsTable } from '../db/schema';
import { type CreateHeroSectionInput, type HeroSection } from '../schema';

export const createHeroSection = async (input: CreateHeroSectionInput): Promise<HeroSection> => {
  try {
    // Insert hero section record
    const result = await db.insert(heroSectionsTable)
      .values({
        headline: input.headline,
        subheadline: input.subheadline,
        mission_statement: input.mission_statement,
        primary_cta_text: input.primary_cta_text,
        primary_cta_url: input.primary_cta_url,
        secondary_cta_text: input.secondary_cta_text,
        secondary_cta_url: input.secondary_cta_url,
        code_snippet: input.code_snippet
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Hero section creation failed:', error);
    throw error;
  }
};
