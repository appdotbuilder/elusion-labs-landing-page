
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { sdkFeaturesTable, sdkShowcasesTable } from '../db/schema';
import { type CreateSdkFeatureInput } from '../schema';
import { createSdkFeature } from '../handlers/create_sdk_feature';
import { eq } from 'drizzle-orm';

describe('createSdkFeature', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  // Helper function to create a test SDK
  const createTestSdk = async () => {
    const result = await db.insert(sdkShowcasesTable)
      .values({
        name: 'Test SDK',
        version: '1.0.0',
        description: 'A test SDK',
        install_command: 'pip install test-sdk',
        code_example: 'import test_sdk',
        documentation_url: 'https://docs.test.com',
        github_url: 'https://github.com/test/sdk',
        pypi_url: 'https://pypi.org/project/test-sdk/',
        is_featured: false
      })
      .returning()
      .execute();
    return result[0];
  };

  it('should create an SDK feature with all fields', async () => {
    const testSdk = await createTestSdk();
    
    const testInput: CreateSdkFeatureInput = {
      sdk_id: testSdk.id,
      name: 'Awesome Feature',
      description: 'This feature does amazing things',
      icon: 'star-icon'
    };

    const result = await createSdkFeature(testInput);

    // Basic field validation
    expect(result.sdk_id).toEqual(testSdk.id);
    expect(result.name).toEqual('Awesome Feature');
    expect(result.description).toEqual(testInput.description);
    expect(result.icon).toEqual('star-icon');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should create an SDK feature without icon', async () => {
    const testSdk = await createTestSdk();
    
    const testInput: CreateSdkFeatureInput = {
      sdk_id: testSdk.id,
      name: 'Simple Feature',
      description: 'A feature without an icon'
    };

    const result = await createSdkFeature(testInput);

    expect(result.sdk_id).toEqual(testSdk.id);
    expect(result.name).toEqual('Simple Feature');
    expect(result.description).toEqual(testInput.description);
    expect(result.icon).toBeNull();
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
  });

  it('should save SDK feature to database', async () => {
    const testSdk = await createTestSdk();
    
    const testInput: CreateSdkFeatureInput = {
      sdk_id: testSdk.id,
      name: 'Database Feature',
      description: 'A feature saved to the database',
      icon: 'database-icon'
    };

    const result = await createSdkFeature(testInput);

    // Query using proper drizzle syntax
    const features = await db.select()
      .from(sdkFeaturesTable)
      .where(eq(sdkFeaturesTable.id, result.id))
      .execute();

    expect(features).toHaveLength(1);
    expect(features[0].sdk_id).toEqual(testSdk.id);
    expect(features[0].name).toEqual('Database Feature');
    expect(features[0].description).toEqual(testInput.description);
    expect(features[0].icon).toEqual('database-icon');
    expect(features[0].created_at).toBeInstanceOf(Date);
  });

  it('should throw error when SDK does not exist', async () => {
    const testInput: CreateSdkFeatureInput = {
      sdk_id: 999, // Non-existent SDK ID
      name: 'Invalid Feature',
      description: 'This should fail'
    };

    expect(createSdkFeature(testInput)).rejects.toThrow(/SDK with id 999 not found/i);
  });

  it('should create multiple features for the same SDK', async () => {
    const testSdk = await createTestSdk();
    
    const feature1Input: CreateSdkFeatureInput = {
      sdk_id: testSdk.id,
      name: 'Feature One',
      description: 'First feature',
      icon: 'icon-1'
    };

    const feature2Input: CreateSdkFeatureInput = {
      sdk_id: testSdk.id,
      name: 'Feature Two',
      description: 'Second feature',
      icon: 'icon-2'
    };

    const result1 = await createSdkFeature(feature1Input);
    const result2 = await createSdkFeature(feature2Input);

    // Verify both features are created with different IDs
    expect(result1.id).not.toEqual(result2.id);
    expect(result1.sdk_id).toEqual(testSdk.id);
    expect(result2.sdk_id).toEqual(testSdk.id);
    expect(result1.name).toEqual('Feature One');
    expect(result2.name).toEqual('Feature Two');

    // Verify both are saved in database
    const allFeatures = await db.select()
      .from(sdkFeaturesTable)
      .where(eq(sdkFeaturesTable.sdk_id, testSdk.id))
      .execute();

    expect(allFeatures).toHaveLength(2);
  });
});
