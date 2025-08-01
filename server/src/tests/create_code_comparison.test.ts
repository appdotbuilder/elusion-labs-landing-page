
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { codeComparisonsTable } from '../db/schema';
import { type CreateCodeComparisonInput } from '../schema';
import { createCodeComparison } from '../handlers/create_code_comparison';
import { eq } from 'drizzle-orm';

// Simple test input
const testInput: CreateCodeComparisonInput = {
  title: 'API Evolution Example',
  description: 'Shows how our API simplifies complex operations',
  before_code: 'const result = await fetch("/api/complex", {\n  method: "POST",\n  headers: { "Content-Type": "application/json" },\n  body: JSON.stringify({ data: complexData })\n});',
  after_code: 'const result = await client.simpleCall(data);',
  before_label: 'Before: Complex Setup',
  after_label: 'After: Simple API'
};

describe('createCodeComparison', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a code comparison', async () => {
    const result = await createCodeComparison(testInput);

    // Basic field validation
    expect(result.title).toEqual('API Evolution Example');
    expect(result.description).toEqual(testInput.description);
    expect(result.before_code).toEqual(testInput.before_code);
    expect(result.after_code).toEqual(testInput.after_code);
    expect(result.before_label).toEqual('Before: Complex Setup');
    expect(result.after_label).toEqual('After: Simple API');
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save code comparison to database', async () => {
    const result = await createCodeComparison(testInput);

    // Query using proper drizzle syntax
    const comparisons = await db.select()
      .from(codeComparisonsTable)
      .where(eq(codeComparisonsTable.id, result.id))
      .execute();

    expect(comparisons).toHaveLength(1);
    expect(comparisons[0].title).toEqual('API Evolution Example');
    expect(comparisons[0].description).toEqual(testInput.description);
    expect(comparisons[0].before_code).toEqual(testInput.before_code);
    expect(comparisons[0].after_code).toEqual(testInput.after_code);
    expect(comparisons[0].created_at).toBeInstanceOf(Date);
    expect(comparisons[0].updated_at).toBeInstanceOf(Date);
  });

  it('should handle multi-line code snippets correctly', async () => {
    const multiLineInput: CreateCodeComparisonInput = {
      title: 'Multi-line Example',
      description: 'Testing multi-line code handling',
      before_code: 'function oldWay() {\n  const step1 = doThis();\n  const step2 = doThat(step1);\n  return step2;\n}',
      after_code: 'const result = newAPI.simple();',
      before_label: 'Old Way',
      after_label: 'New Way'
    };

    const result = await createCodeComparison(multiLineInput);

    expect(result.before_code).toContain('\n');
    expect(result.before_code).toEqual(multiLineInput.before_code);
    expect(result.after_code).toEqual(multiLineInput.after_code);

    // Verify in database
    const saved = await db.select()
      .from(codeComparisonsTable)
      .where(eq(codeComparisonsTable.id, result.id))
      .execute();

    expect(saved[0].before_code).toEqual(multiLineInput.before_code);
    expect(saved[0].after_code).toEqual(multiLineInput.after_code);
  });
});
