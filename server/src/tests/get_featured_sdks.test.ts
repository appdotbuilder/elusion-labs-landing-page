
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { sdkShowcasesTable } from '../db/schema';
import { type CreateSdkShowcaseInput } from '../schema';
import { getFeaturedSdks } from '../handlers/get_featured_sdks';

const testFeaturedSdk: CreateSdkShowcaseInput = {
  name: 'ZenoPay Python SDK',
  version: '1.0.0',
  description: 'Complete Python SDK for ZenoPay API integration',
  install_command: 'pip install zenopay-sdk',
  code_example: 'from zenopay import ZenoPay\n\nclient = ZenoPay(api_key="your-key")',
  documentation_url: 'https://docs.zenopay.com',
  github_url: 'https://github.com/elusion-labs/zenopay-sdk',
  pypi_url: 'https://pypi.org/project/zenopay-sdk/',
  is_featured: true
};

const testNonFeaturedSdk: CreateSdkShowcaseInput = {
  name: 'ZenoPay JavaScript SDK',
  version: '2.0.0',
  description: 'JavaScript SDK for ZenoPay API integration',
  install_command: 'npm install zenopay-js',
  code_example: 'import ZenoPay from "zenopay-js";\n\nconst client = new ZenoPay("your-key");',
  documentation_url: 'https://docs.zenopay.com/js',
  github_url: 'https://github.com/elusion-labs/zenopay-js',
  pypi_url: 'https://npmjs.com/package/zenopay-js',
  is_featured: false
};

describe('getFeaturedSdks', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return featured SDKs only', async () => {
    // Create both featured and non-featured SDKs
    await db.insert(sdkShowcasesTable).values(testFeaturedSdk).execute();
    await db.insert(sdkShowcasesTable).values(testNonFeaturedSdk).execute();

    const result = await getFeaturedSdks();

    expect(result).toHaveLength(1);
    expect(result[0].name).toEqual('ZenoPay Python SDK');
    expect(result[0].is_featured).toBe(true);
  });

  it('should return empty array when no featured SDKs exist', async () => {
    // Create only non-featured SDK
    await db.insert(sdkShowcasesTable).values(testNonFeaturedSdk).execute();

    const result = await getFeaturedSdks();

    expect(result).toHaveLength(0);
  });

  it('should order featured SDKs by creation date descending', async () => {
    // Create multiple featured SDKs with slight delay
    await db.insert(sdkShowcasesTable).values({
      ...testFeaturedSdk,
      name: 'First SDK'
    }).execute();

    // Small delay to ensure different timestamps
    await new Promise(resolve => setTimeout(resolve, 10));

    await db.insert(sdkShowcasesTable).values({
      ...testFeaturedSdk,
      name: 'Second SDK'
    }).execute();

    const result = await getFeaturedSdks();

    expect(result).toHaveLength(2);
    expect(result[0].name).toEqual('Second SDK'); // Most recent first
    expect(result[1].name).toEqual('First SDK');
    expect(result[0].created_at >= result[1].created_at).toBe(true);
  });

  it('should return complete SDK showcase objects', async () => {
    await db.insert(sdkShowcasesTable).values(testFeaturedSdk).execute();

    const result = await getFeaturedSdks();

    expect(result).toHaveLength(1);
    const sdk = result[0];
    
    expect(sdk.id).toBeDefined();
    expect(sdk.name).toEqual('ZenoPay Python SDK');
    expect(sdk.version).toEqual('1.0.0');
    expect(sdk.description).toEqual('Complete Python SDK for ZenoPay API integration');
    expect(sdk.install_command).toEqual('pip install zenopay-sdk');
    expect(sdk.code_example).toContain('from zenopay import ZenoPay');
    expect(sdk.documentation_url).toEqual('https://docs.zenopay.com');
    expect(sdk.github_url).toEqual('https://github.com/elusion-labs/zenopay-sdk');
    expect(sdk.pypi_url).toEqual('https://pypi.org/project/zenopay-sdk/');
    expect(sdk.is_featured).toBe(true);
    expect(sdk.created_at).toBeInstanceOf(Date);
    expect(sdk.updated_at).toBeInstanceOf(Date);
  });
});
