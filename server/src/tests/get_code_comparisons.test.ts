
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { codeComparisonsTable } from '../db/schema';
import { getCodeComparisons } from '../handlers/get_code_comparisons';

describe('getCodeComparisons', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no code comparisons exist', async () => {
    const result = await getCodeComparisons();
    expect(result).toEqual([]);
  });

  it('should return all code comparisons', async () => {
    // Create test data
    await db.insert(codeComparisonsTable).values([
      {
        title: 'Payment Processing',
        description: 'Simplified payment integration',
        before_code: 'import requests\n# Complex setup',
        after_code: 'from zenopay import ZenoPay\n# Simple setup',
        before_label: 'Raw API',
        after_label: 'With SDK'
      },
      {
        title: 'Authentication',
        description: 'Easy auth implementation',
        before_code: 'manual_auth = True',
        after_code: 'auth = sdk.authenticate()',
        before_label: 'Manual',
        after_label: 'Automated'
      }
    ]).execute();

    const result = await getCodeComparisons();

    expect(result).toHaveLength(2);
    
    // Verify first comparison
    expect(result[0].title).toEqual('Payment Processing');
    expect(result[0].description).toEqual('Simplified payment integration');
    expect(result[0].before_code).toEqual('import requests\n# Complex setup');
    expect(result[0].after_code).toEqual('from zenopay import ZenoPay\n# Simple setup');
    expect(result[0].before_label).toEqual('Raw API');
    expect(result[0].after_label).toEqual('With SDK');
    expect(result[0].id).toBeDefined();
    expect(result[0].created_at).toBeInstanceOf(Date);
    expect(result[0].updated_at).toBeInstanceOf(Date);

    // Verify second comparison
    expect(result[1].title).toEqual('Authentication');
    expect(result[1].description).toEqual('Easy auth implementation');
    expect(result[1].before_code).toEqual('manual_auth = True');
    expect(result[1].after_code).toEqual('auth = sdk.authenticate()');
    expect(result[1].before_label).toEqual('Manual');
    expect(result[1].after_label).toEqual('Automated');
    expect(result[1].id).toBeDefined();
    expect(result[1].created_at).toBeInstanceOf(Date);
    expect(result[1].updated_at).toBeInstanceOf(Date);
  });

  it('should return comparisons in insertion order', async () => {
    // Create test data with specific titles for ordering verification
    await db.insert(codeComparisonsTable).values([
      {
        title: 'First Comparison',
        description: 'First description',
        before_code: 'before1',
        after_code: 'after1',
        before_label: 'Before 1',
        after_label: 'After 1'
      },
      {
        title: 'Second Comparison',
        description: 'Second description',
        before_code: 'before2',
        after_code: 'after2',
        before_label: 'Before 2',
        after_label: 'After 2'
      }
    ]).execute();

    const result = await getCodeComparisons();

    expect(result).toHaveLength(2);
    expect(result[0].title).toEqual('First Comparison');
    expect(result[1].title).toEqual('Second Comparison');
  });
});
