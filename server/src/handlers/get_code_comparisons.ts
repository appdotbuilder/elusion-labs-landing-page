
import { db } from '../db';
import { codeComparisonsTable } from '../db/schema';
import { type CodeComparison } from '../schema';

export const getCodeComparisons = async (): Promise<CodeComparison[]> => {
  try {
    const results = await db.select()
      .from(codeComparisonsTable)
      .execute();

    return results;
  } catch (error) {
    console.error('Failed to fetch code comparisons:', error);
    throw error;
  }
};
