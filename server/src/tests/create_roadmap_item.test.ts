
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { roadmapItemsTable } from '../db/schema';
import { type CreateRoadmapItemInput } from '../schema';
import { createRoadmapItem } from '../handlers/create_roadmap_item';
import { eq } from 'drizzle-orm';

// Complete test input with all fields
const testInput: CreateRoadmapItemInput = {
  title: 'Advanced Analytics Dashboard',
  description: 'Build comprehensive analytics dashboard with real-time metrics',
  status: 'planned',
  expected_date: '2024-Q2',
  priority: 3
};

describe('createRoadmapItem', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should create a roadmap item', async () => {
    const result = await createRoadmapItem(testInput);

    // Basic field validation
    expect(result.title).toEqual('Advanced Analytics Dashboard');
    expect(result.description).toEqual(testInput.description);
    expect(result.status).toEqual('planned');
    expect(result.expected_date).toEqual('2024-Q2');
    expect(result.priority).toEqual(3);
    expect(result.id).toBeDefined();
    expect(result.created_at).toBeInstanceOf(Date);
    expect(result.updated_at).toBeInstanceOf(Date);
  });

  it('should save roadmap item to database', async () => {
    const result = await createRoadmapItem(testInput);

    // Query using proper drizzle syntax
    const roadmapItems = await db.select()
      .from(roadmapItemsTable)
      .where(eq(roadmapItemsTable.id, result.id))
      .execute();

    expect(roadmapItems).toHaveLength(1);
    expect(roadmapItems[0].title).toEqual('Advanced Analytics Dashboard');
    expect(roadmapItems[0].description).toEqual(testInput.description);
    expect(roadmapItems[0].status).toEqual('planned');
    expect(roadmapItems[0].expected_date).toEqual('2024-Q2');
    expect(roadmapItems[0].priority).toEqual(3);
    expect(roadmapItems[0].created_at).toBeInstanceOf(Date);
    expect(roadmapItems[0].updated_at).toBeInstanceOf(Date);
  });

  it('should handle default values correctly', async () => {
    const minimalInput: CreateRoadmapItemInput = {
      title: 'Simple Feature',
      description: 'A basic feature implementation',
      status: 'planned', // Must be explicit since TypeScript doesn't see Zod defaults
      priority: 1 // Must be explicit since TypeScript doesn't see Zod defaults
    };

    const result = await createRoadmapItem(minimalInput);

    expect(result.title).toEqual('Simple Feature');
    expect(result.description).toEqual('A basic feature implementation');
    expect(result.status).toEqual('planned');
    expect(result.priority).toEqual(1);
    expect(result.expected_date).toBeNull(); // Optional field not provided
  });

  it('should handle different status values', async () => {
    const inProgressInput: CreateRoadmapItemInput = {
      title: 'In Progress Feature',
      description: 'Feature currently being worked on',
      status: 'in_progress',
      priority: 2
    };

    const result = await createRoadmapItem(inProgressInput);

    expect(result.status).toEqual('in_progress');
    expect(result.priority).toEqual(2);
  });

  it('should handle null expected_date', async () => {
    const inputWithNullDate: CreateRoadmapItemInput = {
      title: 'No Date Feature',
      description: 'Feature without expected date',
      status: 'completed',
      expected_date: null,
      priority: 5
    };

    const result = await createRoadmapItem(inputWithNullDate);

    expect(result.expected_date).toBeNull();
    expect(result.status).toEqual('completed');
    expect(result.priority).toEqual(5);
  });
});
