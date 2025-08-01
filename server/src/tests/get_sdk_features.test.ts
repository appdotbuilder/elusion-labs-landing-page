
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { sdkShowcasesTable, sdkFeaturesTable } from '../db/schema';
import { type CreateSdkShowcaseInput, type CreateSdkFeatureInput } from '../schema';
import { getSdkFeatures } from '../handlers/get_sdk_features';

const testSdkInput: CreateSdkShowcaseInput = {
  name: 'Test SDK',
  version: '1.0.0',
  description: 'A test SDK',
  install_command: 'pip install test-sdk',
  code_example: 'import test_sdk',
  documentation_url: 'https://docs.test.com',
  github_url: 'https://github.com/test/sdk',
  pypi_url: 'https://pypi.org/project/test-sdk',
  is_featured: false
};

const testFeatureInput: CreateSdkFeatureInput = {
  sdk_id: 1,
  name: 'Order Management',
  description: 'Create, update, and track payment orders',
  icon: 'shopping-cart'
};

const testFeatureInput2: CreateSdkFeatureInput = {
  sdk_id: 1,
  name: 'Disbursements',
  description: 'Send money to multiple recipients',
  icon: 'send'
};

describe('getSdkFeatures', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return features for an SDK', async () => {
    // Create SDK first
    const sdkResult = await db.insert(sdkShowcasesTable)
      .values(testSdkInput)
      .returning()
      .execute();

    const sdkId = sdkResult[0].id;

    // Create features for the SDK
    await db.insert(sdkFeaturesTable)
      .values([
        { ...testFeatureInput, sdk_id: sdkId },
        { ...testFeatureInput2, sdk_id: sdkId }
      ])
      .execute();

    const result = await getSdkFeatures(sdkId);

    expect(result).toHaveLength(2);
    expect(result[0].name).toEqual('Order Management');
    expect(result[0].description).toEqual('Create, update, and track payment orders');
    expect(result[0].icon).toEqual('shopping-cart');
    expect(result[0].sdk_id).toEqual(sdkId);
    expect(result[0].created_at).toBeInstanceOf(Date);

    expect(result[1].name).toEqual('Disbursements');
    expect(result[1].description).toEqual('Send money to multiple recipients');
    expect(result[1].icon).toEqual('send');
    expect(result[1].sdk_id).toEqual(sdkId);
  });

  it('should return empty array for SDK with no features', async () => {
    // Create SDK first
    const sdkResult = await db.insert(sdkShowcasesTable)
      .values(testSdkInput)
      .returning()
      .execute();

    const sdkId = sdkResult[0].id;

    const result = await getSdkFeatures(sdkId);

    expect(result).toHaveLength(0);
  });

  it('should return empty array for non-existent SDK', async () => {
    const result = await getSdkFeatures(999);

    expect(result).toHaveLength(0);
  });

  it('should only return features for the specified SDK', async () => {
    // Create two SDKs
    const sdk1Result = await db.insert(sdkShowcasesTable)
      .values(testSdkInput)
      .returning()
      .execute();

    const sdk2Result = await db.insert(sdkShowcasesTable)
      .values({ ...testSdkInput, name: 'Another SDK' })
      .returning()
      .execute();

    const sdk1Id = sdk1Result[0].id;
    const sdk2Id = sdk2Result[0].id;

    // Create features for both SDKs
    await db.insert(sdkFeaturesTable)
      .values([
        { ...testFeatureInput, sdk_id: sdk1Id },
        { ...testFeatureInput2, sdk_id: sdk2Id, name: 'Different Feature' }
      ])
      .execute();

    const result = await getSdkFeatures(sdk1Id);

    expect(result).toHaveLength(1);
    expect(result[0].name).toEqual('Order Management');
    expect(result[0].sdk_id).toEqual(sdk1Id);
  });
});
