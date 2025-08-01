
import { db } from '../db';
import { sdkShowcasesTable } from '../db/schema';
import { type CreateSdkShowcaseInput, type SdkShowcase } from '../schema';

export const createSdkShowcase = async (input: CreateSdkShowcaseInput): Promise<SdkShowcase> => {
  try {
    // Insert SDK showcase record
    const result = await db.insert(sdkShowcasesTable)
      .values({
        name: input.name,
        version: input.version,
        description: input.description,
        install_command: input.install_command,
        code_example: input.code_example,
        documentation_url: input.documentation_url,
        github_url: input.github_url,
        pypi_url: input.pypi_url,
        is_featured: input.is_featured
      })
      .returning()
      .execute();

    return result[0];
  } catch (error) {
    console.error('SDK showcase creation failed:', error);
    throw error;
  }
};
