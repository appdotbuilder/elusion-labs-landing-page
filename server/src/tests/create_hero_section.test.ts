
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { heroSectionsTable } from '../db/schema';
import { type CreateHeroSectionInput } from '../schema';
import { createHeroSection } from '../handlers/create_hero_section';
import { eq } from 'drizzle-orm';

// Test input with all required fields
const testInput: CreateHeroSectionInput = {
  headline: 'Build Better APIs Faster',
  subheadline: 'The developer-first platform for modern API development',
  mission_statement: 'We believe in making API development simple and powerful',
  primary_cta_text: 'Get Started',
  primary_cta_url: '/signup',
  secondary_cta_text: 'View Documentation',
  secondary_cta_url: '/docs',
  code_snippet: 'npm install @acme/sdk'
};

describe('createHeroSection', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a hero section', async () => {
    const result = await createHeroSection(testInput);

    // Basic field validation
    expect(result.headline).toEqual('Build Better APIs Faster');
    expect(result.subheadline).toEqual(testInput.subheadline);
    expect(result.mission_statement).toEqual(testInput.mission_statement);
    expect(result.primary_cta_text).toEqual('Get Started');
    expect(result.primary_cta_url).toEqual('/signup');
    expect(result.secondary_cta_text).toEqual('View Documentation');
    expect(result.secondary_cta_url).toEqual('/docs');
    expect(result.code_snippet).toEqual('npm install @acme/sdk');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save hero section to database', async () => {
    const result = await createHeroSection(testInput);

    // Query using proper drizzle syntax
    const heroSections = await db.select()
      .from(heroSectionsTable)
      .where(eq(heroSectionsTable.id, result.id))
      .execute();

    expect(heroSections).toHaveLength(1);
    expect(heroSections[0].headline).toEqual('Build Better APIs Faster');
    expect(heroSections[0].subheadline).toEqual(testInput.subheadline);
    expect(heroSections[0].mission_statement).toEqual(testInput.mission_statement);
    expect(heroSections[0].primary_cta_text).toEqual('Get Started');
    expect(heroSections[0].primary_cta_url).toEqual('/signup');
    expect(heroSections[0].secondary_cta_text).toEqual('View Documentation');
    expect(heroSections[0].secondary_cta_url).toEqual('/docs');
    expect(heroSections[0].code_snippet).toEqual('npm install @acme/sdk');
    expect(heroSections[0].created_at).toBeInstanceOf(Date);
    expect(heroSections[0].updated_at).toBeInstanceOf(Date);
  });

  it('should set updated_at automatically', async () => {
    const result = await createHeroSection(testInput);

    // Verify timestamps are set automatically
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
    
    // Both timestamps should be close to current time
    const now = new Date();
    const timeDiff = Math.abs(now.getTime() - result.created_at.getTime());
    expect(timeDiff).toBeLessThan(5000); // Within 5 seconds
  });
});
