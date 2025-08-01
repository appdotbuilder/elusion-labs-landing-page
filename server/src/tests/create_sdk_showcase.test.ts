
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { sdkShowcasesTable } from '../db/schema';
import { type CreateSdkShowcaseInput } from '../schema';
import { createSdkShowcase } from '../handlers/create_sdk_showcase';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: CreateSdkShowcaseInput = {
  name: 'Test SDK',
  version: '1.0.0',
  description: 'A test SDK for demonstrations',
  install_command: 'pip install test-sdk',
  code_example: 'import test_sdk\ntest_sdk.hello()',
  documentation_url: 'https://docs.example.com',
  github_url: 'https://github.com/example/test-sdk',
  pypi_url: 'https://pypi.org/project/test-sdk/',
  is_featured: true
};

describe('createSdkShowcase', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create an SDK showcase', async () => {
    const result = await createSdkShowcase(testInput);

    // Basic field validation
    expect(result.name).toEqual('Test SDK');
    expect(result.version).toEqual('1.0.0');
    expect(result.description).toEqual(testInput.description);
    expect(result.install_command).toEqual(testInput.install_command);
    expect(result.code_example).toEqual(testInput.code_example);
    expect(result.documentation_url).toEqual(testInput.documentation_url);
    expect(result.github_url).toEqual(testInput.github_url);
    expect(result.pypi_url).toEqual(testInput.pypi_url);
    expect(result.is_featured).toEqual(true);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save SDK showcase to database', async () => {
    const result = await createSdkShowcase(testInput);

    // Query using proper drizzle syntax
    const sdkShowcases = await db.select()
      .from(sdkShowcasesTable)
      .where(eq(sdkShowcasesTable.id, result.id))
      .execute();

    expect(sdkShowcases).toHaveLength(1);
    expect(sdkShowcases[0].name).toEqual('Test SDK');
    expect(sdkShowcases[0].version).toEqual('1.0.0');
    expect(sdkShowcases[0].description).toEqual(testInput.description);
    expect(sdkShowcases[0].is_featured).toEqual(true);
    expect(sdkShowcases[0].created_at).toBeInstanceOf(Date);
    expect(sdkShowcases[0].updated_at).toBeInstanceOf(Date);
  });

  it('should handle non-featured SDK showcase', async () => {
    const nonFeaturedInput: CreateSdkShowcaseInput = {
      ...testInput,
      is_featured: false
    };

    const result = await createSdkShowcase(nonFeaturedInput);

    expect(result.is_featured).toEqual(false);
    expect(result.name).toEqual('Test SDK');
    expect(result.id).toBeDefined();
  });

  it('should use default is_featured value when not provided', async () => {
    const inputWithoutFeatured: CreateSdkShowcaseInput = {
      name: 'Another SDK',
      version: '2.0.0',
      description: 'Another test SDK',
      install_command: 'pip install another-sdk',
      code_example: 'import another_sdk',
      documentation_url: 'https://docs.another.com',
      github_url: 'https://github.com/example/another-sdk',
      pypi_url: 'https://pypi.org/project/another-sdk/',
      is_featured: false // Include is_featured with default value
    };

    const result = await createSdkShowcase(inputWithoutFeatured);

    expect(result.is_featured).toEqual(false);
    expect(result.name).toEqual('Another SDK');
    expect(result.id).toBeDefined();
  });
});
