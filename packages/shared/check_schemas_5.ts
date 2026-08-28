import { z } from 'zod';
import * as schemas from './src/schemas/index.ts';
import type { Tables } from './src/database.types.ts';

// Let's do a strict type extraction to see what missing properties are between Zod and DB

type DBIntegrationMapping = Tables<'integration_mappings'>;
type ZodIntegrationMapping = z.infer<typeof schemas.IntegrationMappingSchema>;

type Exclude<T, U> = T extends U ? never : T;

const missingInDBIntegrationMapping: Exclude<keyof ZodIntegrationMapping, keyof DBIntegrationMapping> = null as never;
const missingInZodIntegrationMapping: Exclude<keyof DBIntegrationMapping, keyof ZodIntegrationMapping> = null as never;
