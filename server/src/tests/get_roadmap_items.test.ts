
import { afterEach, beforeEach, describe, expect, it } from 'bun:test';
import { resetDB, createDB } from '../helpers';
import { db } from '../db';
import { roadmapItemsTable } from '../db/schema';
import { type CreateRoadmapItemInput } from '../schema';
import { getRoadmapItems } from '../handlers/get_roadmap_items';

// Test roadmap items with different priorities and statuses
const testRoadmapItems: CreateRoadmapItemInput[] = [
  {
    title: 'High Priority Completed',
    description: 'A completed high priority item',
    status: 'completed',
    expected_date: 'Q1 2024',
    priority: 1
  },
  {
    title: 'High Priority In Progress',
    description: 'An in progress high priority item',
    status: 'in_progress',
    expected_date: 'Q2 2024',
    priority: 1
  },
  {
    title: 'Low Priority Planned',
    description: 'A planned low priority item',
    status: 'planned',
    expected_date: 'Q4 2024',
    priority: 3
  },
  {
    title: 'Medium Priority Completed',
    description: 'A completed medium priority item',
    status: 'completed',
    expected_date: null,
    priority: 2
  }
];

describe('getRoadmapItems', () => {
  beforeEach(createDB);
  afterEach(resetDB);

  it('should return empty array when no roadmap items exist', async () => {
    const result = await getRoadmapItems();
    expect(result).toEqual([]);
  });

  it('should return all roadmap items', async () => {
    // Insert test data
    await db.insert(roadmapItemsTable)
      .values(testRoadmapItems)
      .execute();

    const result = await getRoadmapItems();

    expect(result).toHaveLength(4);
    
    // Verify all expected fields are present
    result.forEach(item => {
      expect(item.id).toBeDefined();
      expect(item.title).toBeDefined();
      expect(item.description).toBeDefined();
      expect(item.status).toBeDefined();
      expect(item.priority).toBeDefined();
      expect(item.created_at).toBeInstanceOf(Date);
      expect(item.updated_at).toBeInstanceOf(Date);
    });
  });

  it('should order items by priority first', async () => {
    // Insert test data
    await db.insert(roadmapItemsTable)
      .values(testRoadmapItems)
      .execute();

    const result = await getRoadmapItems();

    // Check that priority 1 items come before priority 2, which come before priority 3
    const priorities = result.map(item => item.priority);
    expect(priorities[0]).toBe(1); // First item should be priority 1
    expect(priorities[1]).toBe(1); // Second item should also be priority 1
    expect(priorities[2]).toBe(2); // Third item should be priority 2
    expect(priorities[3]).toBe(3); // Fourth item should be priority 3
  });

  it('should order items by status within same priority', async () => {
    // Insert test data
    await db.insert(roadmapItemsTable)
      .values(testRoadmapItems)
      .execute();

    const result = await getRoadmapItems();

    // Among priority 1 items, completed should come before in_progress
    const priority1Items = result.filter(item => item.priority === 1);
    expect(priority1Items).toHaveLength(2);
    expect(priority1Items[0].status).toBe('completed');
    expect(priority1Items[1].status).toBe('in_progress');
  });

  it('should handle nullable expected_date correctly', async () => {
    // Insert test data
    await db.insert(roadmapItemsTable)
      .values(testRoadmapItems)
      .execute();

    const result = await getRoadmapItems();

    // Find item with null expected_date
    const itemWithNullDate = result.find(item => item.title === 'Medium Priority Completed');
    expect(itemWithNullDate).toBeDefined();
    expect(itemWithNullDate?.expected_date).toBeNull();

    // Find item with expected_date
    const itemWithDate = result.find(item => item.title === 'High Priority Completed');
    expect(itemWithDate).toBeDefined();
    expect(itemWithDate?.expected_date).toBe('Q1 2024');
  });

  it('should handle all roadmap statuses correctly', async () => {
    // Insert test data
    await db.insert(roadmapItemsTable)
      .values(testRoadmapItems)  
      .execute();

    const result = await getRoadmapItems();

    const statuses = result.map(item => item.status);
    expect(statuses).toContain('planned');
    expect(statuses).toContain('in_progress');
    expect(statuses).toContain('completed');
  });
});
