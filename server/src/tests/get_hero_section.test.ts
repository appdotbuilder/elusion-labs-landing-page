
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { heroSectionsTable } from '../db/schema';
import { getHeroSection } from '../handlers/get_hero_section';

describe('getHeroSection', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return null when no hero section exists', async () => {
    const result = await getHeroSection();
    expect(result).toBeNull();
  });

  it('should return the hero section when one exists', async () => {
    // Create a test hero section
    await db.insert(heroSectionsTable)
      .values({
        headline: 'Test Headline',
        subheadline: 'Test Subheadline',
        mission_statement: 'Test Mission',
        primary_cta_text: 'Primary CTA',
        primary_cta_url: '#primary',
        secondary_cta_text: 'Secondary CTA',
        secondary_cta_url: '#secondary',
        code_snippet: 'console.log("test");'
      })
      .execute();

    const result = await getHeroSection();

    expect(result).not.toBeNull();
    expect(result!.headline).toEqual('Test Headline');
    expect(result!.subheadline).toEqual('Test Subheadline');
    expect(result!.mission_statement).toEqual('Test Mission');
    expect(result!.primary_cta_text).toEqual('Primary CTA');
    expect(result!.primary_cta_url).toEqual('#primary');
    expect(result!.secondary_cta_text).toEqual('Secondary CTA');
    expect(result!.secondary_cta_url).toEqual('#secondary');
    expect(result!.code_snippet).toEqual('console.log("test");');
    expect(result!.id).toBeDefined();
    expect(result!.created_at).toBeInstanceOf(Date);
    expect(result!.updated_at).toBeInstanceOf(Date);
  });

  it('should return the most recent hero section when multiple exist', async () => {
    // Create first hero section
    await db.insert(heroSectionsTable)
      .values({
        headline: 'Old Headline',
        subheadline: 'Old Subheadline',
        mission_statement: 'Old Mission',
        primary_cta_text: 'Old Primary CTA',
        primary_cta_url: '#old-primary',
        secondary_cta_text: 'Old Secondary CTA',
        secondary_cta_url: '#old-secondary',
        code_snippet: 'console.log("old");'
      })
      .execute();

    // Wait a bit to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    // Create second (newer) hero section
    await db.insert(heroSectionsTable)
      .values({
        headline: 'New Headline',
        subheadline: 'New Subheadline',
        mission_statement: 'New Mission',
        primary_cta_text: 'New Primary CTA',
        primary_cta_url: '#new-primary',
        secondary_cta_text: 'New Secondary CTA',
        secondary_cta_url: '#new-secondary',
        code_snippet: 'console.log("new");'
      })
      .execute();

    const result = await getHeroSection();

    expect(result).not.toBeNull();
    expect(result!.headline).toEqual('New Headline');
    expect(result!.subheadline).toEqual('New Subheadline');
    expect(result!.mission_statement).toEqual('New Mission');
    expect(result!.code_snippet).toEqual('console.log("new");');
  });
});
