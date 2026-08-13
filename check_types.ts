import { z } from 'zod';
import * as Schema from './packages/shared/src/schemas/index.js';
import { Database } from './packages/shared/src/database.types.js';

type DB = Database['public']['Tables'];

const checkIntegrationMapping: DB['integration_mappings']['Row'] = {} as unknown as z.infer<typeof Schema.IntegrationMappingSchema>;
const checkIntegrationMapping2: z.infer<typeof Schema.IntegrationMappingSchema> = {} as unknown as DB['integration_mappings']['Row'];

const checkIntegration: DB['integrations']['Row'] = {} as unknown as z.infer<typeof Schema.IntegrationSchema>;
const checkIntegration2: z.infer<typeof Schema.IntegrationSchema> = {} as unknown as DB['integrations']['Row'];
