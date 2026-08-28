import { z } from 'zod';
import * as schemas from './src/schemas/index.ts';
import type { Tables } from './src/database.types.ts';

// WorkItems
type DBWorkItem = Tables<'work_items'>;
type ZodWorkItem = z.infer<typeof schemas.WorkItemSchema>;
const m1: Exclude<keyof ZodWorkItem, keyof DBWorkItem> = null as never;
const m2: Exclude<keyof DBWorkItem, keyof ZodWorkItem> = null as never;
