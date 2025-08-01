
import { db } from '../db';
import { codeComparisonsTable } from '../db/schema';
import { type CreateCodeComparisonInput, type CodeComparison } from '../schema';

export const createCodeComparison = async (input: CreateCodeComparisonInput): Promise<CodeComparison> => {
  try {
    // Insert code comparison record
    const result = await db.insert(codeComparisonsTable)
      .values({
        title: input.title,
        description: input.description,
        before_code: input.before_code,
        after_code: input.after_code,
        before_label: input.before_label,
        after_label: input.after_label
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('Code comparison creation failed:', error);
    throw error;
  }
};
