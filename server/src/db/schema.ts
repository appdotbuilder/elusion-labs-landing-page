
import { serial, text, pgTable, timestamp, integer, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enum for roadmap item status
export const roadmapStatusEnum = pgEnum('roadmap_status', ['planned', 'in_progress', 'completed']);

// Hero section table
export const heroSectionsTable = pgTable('hero_sections', {
  id: serial('id').primaryKey(),
  headline: text('headline').notNull(),
  subheadline: text('subheadline').notNull(),
  mission_statement: text('mission_statement').notNull(),
  primary_cta_text: text('primary_cta_text').notNull(),
  primary_cta_url: text('primary_cta_url').notNull(),
  secondary_cta_text: text('secondary_cta_text').notNull(),
  secondary_cta_url: text('secondary_cta_url').notNull(),
  code_snippet: text('code_snippet').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// SDK showcase table
export const sdkShowcasesTable = pgTable('sdk_showcases', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  version: text('version').notNull(),
  description: text('description').notNull(),
  install_command: text('install_command').notNull(),
  code_example: text('code_example').notNull(),
  documentation_url: text('documentation_url').notNull(),
  github_url: text('github_url').notNull(),
  pypi_url: text('pypi_url').notNull(),
  is_featured: boolean('is_featured').default(false).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// SDK features table
export const sdkFeaturesTable = pgTable('sdk_features', {
  id: serial('id').primaryKey(),
  sdk_id: integer('sdk_id').notNull().references(() => sdkShowcasesTable.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description').notNull(),
  icon: text('icon'), // Nullable for optional icons
  created_at: timestamp('created_at').defaultNow().notNull()
});

// Code comparison table (before/after examples)
export const codeComparisonsTable = pgTable('code_comparisons', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  before_code: text('before_code').notNull(),
  after_code: text('after_code').notNull(),
  before_label: text('before_label').notNull(),
  after_label: text('after_label').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Community stats table
export const communityStatsTable = pgTable('community_stats', {
  id: serial('id').primaryKey(),
  github_stars: integer('github_stars').notNull(),
  total_downloads: integer('total_downloads').notNull(),
  contributors: integer('contributors').notNull(),
  repositories: integer('repositories').notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Roadmap items table
export const roadmapItemsTable = pgTable('roadmap_items', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  status: roadmapStatusEnum('status').default('planned').notNull(),
  expected_date: text('expected_date'), // Nullable for flexible dates
  priority: integer('priority').default(1).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Relations
export const sdkShowcasesRelations = relations(sdkShowcasesTable, ({ many }) => ({
  features: many(sdkFeaturesTable)
}));

export const sdkFeaturesRelations = relations(sdkFeaturesTable, ({ one }) => ({
  sdk: one(sdkShowcasesTable, {
    fields: [sdkFeaturesTable.sdk_id],
    references: [sdkShowcasesTable.id]
  })
}));

// TypeScript types for the table schemas
export type HeroSection = typeof heroSectionsTable.$inferSelect;
export type NewHeroSection = typeof heroSectionsTable.$inferInsert;

export type SdkShowcase = typeof sdkShowcasesTable.$inferSelect;
export type NewSdkShowcase = typeof sdkShowcasesTable.$inferInsert;

export type SdkFeature = typeof sdkFeaturesTable.$inferSelect;
export type NewSdkFeature = typeof sdkFeaturesTable.$inferInsert;

export type CodeComparison = typeof codeComparisonsTable.$inferSelect;
export type NewCodeComparison = typeof codeComparisonsTable.$inferInsert;

export type CommunityStats = typeof communityStatsTable.$inferSelect;
export type NewCommunityStats = typeof communityStatsTable.$inferInsert;

export type RoadmapItem = typeof roadmapItemsTable.$inferSelect;
export type NewRoadmapItem = typeof roadmapItemsTable.$inferInsert;

// Export all tables for relation queries
export const tables = {
  heroSections: heroSectionsTable,
  sdkShowcases: sdkShowcasesTable,
  sdkFeatures: sdkFeaturesTable,
  codeComparisons: codeComparisonsTable,
  communityStats: communityStatsTable,
  roadmapItems: roadmapItemsTable
};
