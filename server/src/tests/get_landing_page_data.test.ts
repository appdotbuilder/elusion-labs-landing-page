
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { 
  heroSectionsTable, 
  sdkShowcasesTable, 
  sdkFeaturesTable, 
  codeComparisonsTable, 
  communityStatsTable, 
  roadmapItemsTable 
} from '../db/schema';
import { getLandingPageData } from '../handlers/get_landing_page_data';

describe('getLandingPageData', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should throw error when no hero section exists', async () => {
    // Create community stats but no hero section
    await db.insert(communityStatsTable).values({
      github_stars: 100,
      total_downloads: 1000,
      contributors: 10,
      repositories: 5
    }).execute();

    expect(getLandingPageData()).rejects.toThrow(/no hero section found/i);
  });

  it('should throw error when no community stats exist', async () => {
    // Create hero section but no community stats
    await db.insert(heroSectionsTable).values({
      headline: 'Test Headline',
      subheadline: 'Test Subheadline',
      mission_statement: 'Test Mission',
      primary_cta_text: 'Get Started',
      primary_cta_url: '/start',
      secondary_cta_text: 'Learn More',
      secondary_cta_url: '/learn',
      code_snippet: 'console.log("test");'
    }).execute();

    expect(getLandingPageData()).rejects.toThrow(/no community stats found/i);
  });

  it('should return landing page data with minimal required data', async () => {
    // Create required hero section
    await db.insert(heroSectionsTable).values({
      headline: 'Test Headline',
      subheadline: 'Test Subheadline',
      mission_statement: 'Test Mission',
      primary_cta_text: 'Get Started',
      primary_cta_url: '/start',
      secondary_cta_text: 'Learn More',
      secondary_cta_url: '/learn',
      code_snippet: 'console.log("test");'
    }).execute();

    // Create required community stats
    await db.insert(communityStatsTable).values({
      github_stars: 100,
      total_downloads: 1000,
      contributors: 10,
      repositories: 5
    }).execute();

    const result = await getLandingPageData();

    // Verify hero section
    expect(result.hero.headline).toEqual('Test Headline');
    expect(result.hero.subheadline).toEqual('Test Subheadline');
    expect(result.hero.mission_statement).toEqual('Test Mission');
    expect(result.hero.id).toBeDefined();
    expect(result.hero.created_at).toBeInstanceOf(Date);

    // Verify community stats
    expect(result.community_stats.github_stars).toEqual(100);
    expect(result.community_stats.total_downloads).toEqual(1000);
    expect(result.community_stats.contributors).toEqual(10);
    expect(result.community_stats.repositories).toEqual(5);
    expect(result.community_stats.updated_at).toBeInstanceOf(Date);

    // Verify empty arrays for optional data
    expect(result.featured_sdks).toEqual([]);
    expect(result.sdk_features).toEqual([]);
    expect(result.code_comparisons).toEqual([]);
    expect(result.roadmap).toEqual([]);
  });

  it('should return complete landing page data with all sections', async () => {
    // Create hero section
    await db.insert(heroSectionsTable).values({
      headline: 'Complete Test',
      subheadline: 'Full Data Test',
      mission_statement: 'Complete Mission',
      primary_cta_text: 'Start Now',
      primary_cta_url: '/start-now',
      secondary_cta_text: 'Documentation',
      secondary_cta_url: '/docs',
      code_snippet: 'import sdk; sdk.init()'
    }).execute();

    // Create community stats
    await db.insert(communityStatsTable).values({
      github_stars: 500,
      total_downloads: 5000,
      contributors: 25,
      repositories: 12
    }).execute();

    // Create featured SDK
    const sdkResult = await db.insert(sdkShowcasesTable).values({
      name: 'Test SDK',
      version: '1.0.0',
      description: 'A test SDK',
      install_command: 'pip install test-sdk',
      code_example: 'import test_sdk',
      documentation_url: 'https://docs.test.com',
      github_url: 'https://github.com/test/sdk',
      pypi_url: 'https://pypi.org/test-sdk',
      is_featured: true
    }).returning().execute();

    // Create SDK feature
    await db.insert(sdkFeaturesTable).values({
      sdk_id: sdkResult[0].id,
      name: 'Easy Integration',
      description: 'Simple to integrate',
      icon: 'check-icon'
    }).execute();

    // Create code comparison
    await db.insert(codeComparisonsTable).values({
      title: 'Before vs After',
      description: 'See the difference',
      before_code: 'complex_old_code()',
      after_code: 'simple_new_code()',
      before_label: 'Without SDK',
      after_label: 'With SDK'
    }).execute();

    // Create roadmap item
    await db.insert(roadmapItemsTable).values({
      title: 'New Feature',
      description: 'Adding new feature',
      status: 'planned',
      expected_date: '2024-Q2',
      priority: 1
    }).execute();

    const result = await getLandingPageData();

    // Verify all sections are populated
    expect(result.hero.headline).toEqual('Complete Test');
    expect(result.featured_sdks).toHaveLength(1);
    expect(result.featured_sdks[0].name).toEqual('Test SDK');
    expect(result.featured_sdks[0].is_featured).toBe(true);
    
    expect(result.sdk_features).toHaveLength(1);
    expect(result.sdk_features[0].name).toEqual('Easy Integration');
    expect(result.sdk_features[0].sdk_id).toEqual(sdkResult[0].id);
    
    expect(result.code_comparisons).toHaveLength(1);
    expect(result.code_comparisons[0].title).toEqual('Before vs After');
    
    expect(result.community_stats.github_stars).toEqual(500);
    
    expect(result.roadmap).toHaveLength(1);
    expect(result.roadmap[0].title).toEqual('New Feature');
    expect(result.roadmap[0].status).toEqual('planned');
  });

  it('should return only featured SDKs', async () => {
    // Create required data
    await db.insert(heroSectionsTable).values({
      headline: 'Test',
      subheadline: 'Test',
      mission_statement: 'Test',
      primary_cta_text: 'Test',
      primary_cta_url: '/test',
      secondary_cta_text: 'Test',
      secondary_cta_url: '/test',
      code_snippet: 'test'
    }).execute();

    await db.insert(communityStatsTable).values({
      github_stars: 1,
      total_downloads: 1,
      contributors: 1,
      repositories: 1
    }).execute();

    // Create both featured and non-featured SDKs
    await db.insert(sdkShowcasesTable).values([
      {
        name: 'Featured SDK',
        version: '1.0.0',
        description: 'Featured',
        install_command: 'pip install featured',
        code_example: 'import featured',
        documentation_url: 'https://docs.featured.com',
        github_url: 'https://github.com/featured',
        pypi_url: 'https://pypi.org/featured',
        is_featured: true
      },
      {
        name: 'Regular SDK',
        version: '1.0.0',
        description: 'Regular',
        install_command: 'pip install regular',
        code_example: 'import regular',
        documentation_url: 'https://docs.regular.com',
        github_url: 'https://github.com/regular',
        pypi_url: 'https://pypi.org/regular',
        is_featured: false
      }
    ]).execute();

    const result = await getLandingPageData();

    expect(result.featured_sdks).toHaveLength(1);
    expect(result.featured_sdks[0].name).toEqual('Featured SDK');
    expect(result.featured_sdks[0].is_featured).toBe(true);
  });
});
