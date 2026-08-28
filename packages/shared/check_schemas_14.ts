import { z } from 'zod';
import * as schemas from './src/schemas/index.ts';
import type { Tables } from './src/database.types.ts';

// IntegrationMappings
type DBIntegrationMapping = Tables<'integration_mappings'>;
type ZodIntegrationMapping = z.infer<typeof schemas.IntegrationMappingSchema>;
const t33: DBIntegrationMapping = null as unknown as ZodIntegrationMapping;
const t34: ZodIntegrationMapping = null as unknown as DBIntegrationMapping;
