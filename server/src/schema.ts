
import { z } from 'zod';

// Hero section schema
export const heroSectionSchema = z.object({
  id: z.number(),
  headline: z.string(),
  subheadline: z.string(),
  mission_statement: z.string(),
  primary_cta_text: z.string(),
  primary_cta_url: z.string(),
  secondary_cta_text: z.string(),
  secondary_cta_url: z.string(),
  code_snippet: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type HeroSection = z.infer<typeof heroSectionSchema>;

// SDK showcase schema
export const sdkShowcaseSchema = z.object({
  id: z.number(),
  name: z.string(),
  version: z.string(),
  description: z.string(),
  install_command: z.string(),
  code_example: z.string(),
  documentation_url: z.string(),
  github_url: z.string(),
  pypi_url: z.string(),
  is_featured: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type SdkShowcase = z.infer<typeof sdkShowcaseSchema>;

// SDK features schema
export const sdkFeatureSchema = z.object({
  id: z.number(),
  sdk_id: z.number(),
  name: z.string(),
  description: z.string(),
  icon: z.string().nullable(),
  created_at: z.coerce.date()
});

export type SdkFeature = z.infer<typeof sdkFeatureSchema>;

// Code comparison schema (before/after examples)
export const codeComparisonSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  before_code: z.string(),
  after_code: z.string(),
  before_label: z.string(),
  after_label: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type CodeComparison = z.infer<typeof codeComparisonSchema>;

// Community stats schema
export const communityStatsSchema = z.object({
  id: z.number(),
  github_stars: z.number().int(),
  total_downloads: z.number().int(),
  contributors: z.number().int(),
  repositories: z.number().int(),
  updated_at: z.coerce.date()
});

export type CommunityStats = z.infer<typeof communityStatsSchema>;

// Roadmap items schema
export const roadmapItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  description: z.string(),
  status: z.enum(['planned', 'in_progress', 'completed']),
  expected_date: z.string().nullable(),
  priority: z.number().int(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type RoadmapItem = z.infer<typeof roadmapItemSchema>;

// Input schemas for creating/updating
export const createHeroSectionInputSchema = z.object({
  headline: z.string(),
  subheadline: z.string(),
  mission_statement: z.string(),
  primary_cta_text: z.string(),
  primary_cta_url: z.string(),
  secondary_cta_text: z.string(),
  secondary_cta_url: z.string(),
  code_snippet: z.string()
});

export type CreateHeroSectionInput = z.infer<typeof createHeroSectionInputSchema>;

export const createSdkShowcaseInputSchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string(),
  install_command: z.string(),
  code_example: z.string(),
  documentation_url: z.string(),
  github_url: z.string(),
  pypi_url: z.string(),
  is_featured: z.boolean().default(false)
});

export type CreateSdkShowcaseInput = z.infer<typeof createSdkShowcaseInputSchema>;

export const createSdkFeatureInputSchema = z.object({
  sdk_id: z.number(),
  name: z.string(),
  description: z.string(),
  icon: z.string().nullable().optional()
});

export type CreateSdkFeatureInput = z.infer<typeof createSdkFeatureInputSchema>;

export const createCodeComparisonInputSchema = z.object({
  title: z.string(),
  description: z.string(),
  before_code: z.string(),
  after_code: z.string(),
  before_label: z.string(),
  after_label: z.string()
});

export type CreateCodeComparisonInput = z.infer<typeof createCodeComparisonInputSchema>;

export const updateCommunityStatsInputSchema = z.object({
  github_stars: z.number().int().optional(),
  total_downloads: z.number().int().optional(),
  contributors: z.number().int().optional(),
  repositories: z.number().int().optional()
});

export type UpdateCommunityStatsInput = z.infer<typeof updateCommunityStatsInputSchema>;

export const createRoadmapItemInputSchema = z.object({
  title: z.string(),
  description: z.string(),
  status: z.enum(['planned', 'in_progress', 'completed']).default('planned'),
  expected_date: z.string().nullable().optional(),
  priority: z.number().int().default(1)
});

export type CreateRoadmapItemInput = z.infer<typeof createRoadmapItemInputSchema>;

// Landing page data aggregation schema
export const landingPageDataSchema = z.object({
  hero: heroSectionSchema,
  featured_sdks: z.array(sdkShowcaseSchema),
  sdk_features: z.array(sdkFeatureSchema),
  code_comparisons: z.array(codeComparisonSchema),
  community_stats: communityStatsSchema,
  roadmap: z.array(roadmapItemSchema)
});

export type LandingPageData = z.infer<typeof landingPageDataSchema>;
