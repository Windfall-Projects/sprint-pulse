import { z } from 'zod';
import * as schemas from './src/schemas/index.js';
import type { Tables } from './src/database.types.js';

type DBWorkItem = Tables<'work_items'>;
type ZodWorkItem = z.infer<typeof schemas.WorkItemSchema>;

type Exclude<T, U> = T extends U ? never : T;

// This will error if DBWorkItem has properties not in ZodWorkItem
const missingInZod: Exclude<keyof DBWorkItem, keyof ZodWorkItem> = null as never;

// This will error if ZodWorkItem has properties not in DBWorkItem
const missingInDB: Exclude<keyof ZodWorkItem, keyof DBWorkItem> = null as never;

console.log("Check complete.");
