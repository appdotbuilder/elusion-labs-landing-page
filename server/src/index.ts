
import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { 
  createHeroSectionInputSchema,
  createSdkShowcaseInputSchema,
  createSdkFeatureInputSchema,
  createCodeComparisonInputSchema,
  updateCommunityStatsInputSchema,
  createRoadmapItemInputSchema
} from './schema';
import { getLandingPageData } from './handlers/get_landing_page_data';
import { createHeroSection } from './handlers/create_hero_section';
import { getHeroSection } from './handlers/get_hero_section';
import { createSdkShowcase } from './handlers/create_sdk_showcase';
import { getFeaturedSdks } from './handlers/get_featured_sdks';
import { createSdkFeature } from './handlers/create_sdk_feature';
import { getSdkFeatures } from './handlers/get_sdk_features';
import { createCodeComparison } from './handlers/create_code_comparison';
import { getCodeComparisons } from './handlers/get_code_comparisons';
import { updateCommunityStats } from './handlers/update_community_stats';
import { getCommunityStats } from './handlers/get_community_stats';
import { createRoadmapItem } from './handlers/create_roadmap_item';
import { getRoadmapItems } from './handlers/get_roadmap_items';
import { z } from 'zod';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Landing page data aggregation
  getLandingPageData: publicProcedure
    .query(() => getLandingPageData()),

  // Hero section management
  createHeroSection: publicProcedure
    .input(createHeroSectionInputSchema)
    .mutation(({ input }) => createHeroSection(input)),
  
  getHeroSection: publicProcedure
    .query(() => getHeroSection()),

  // SDK showcase management
  createSdkShowcase: publicProcedure
    .input(createSdkShowcaseInputSchema)
    .mutation(({ input }) => createSdkShowcase(input)),
  
  getFeaturedSdks: publicProcedure
    .query(() => getFeaturedSdks()),

  // SDK features management
  createSdkFeature: publicProcedure
    .input(createSdkFeatureInputSchema)
    .mutation(({ input }) => createSdkFeature(input)),
  
  getSdkFeatures: publicProcedure
    .input(z.object({ sdkId: z.number() }))
    .query(({ input }) => getSdkFeatures(input.sdkId)),

  // Code comparisons management
  createCodeComparison: publicProcedure
    .input(createCodeComparisonInputSchema)
    .mutation(({ input }) => createCodeComparison(input)),
  
  getCodeComparisons: publicProcedure
    .query(() => getCodeComparisons()),

  // Community stats management
  updateCommunityStats: publicProcedure
    .input(updateCommunityStatsInputSchema)
    .mutation(({ input }) => updateCommunityStats(input)),
  
  getCommunityStats: publicProcedure
    .query(() => getCommunityStats()),

  // Roadmap management
  createRoadmapItem: publicProcedure
    .input(createRoadmapItemInputSchema)
    .mutation(({ input }) => createRoadmapItem(input)),
  
  getRoadmapItems: publicProcedure
    .query(() => getRoadmapItems())
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();
