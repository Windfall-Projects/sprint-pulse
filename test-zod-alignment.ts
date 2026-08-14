import { z } from 'zod';
import type { Database } from './packages/shared/src/database.types';
import * as Schemas from './packages/shared/src/schemas/index';

type DB = Database['public']['Tables'];

const checkProfile: DB['profiles']['Row'] = {} as unknown as z.infer<typeof Schemas.ProfileSchema>;
const checkAccount: DB['accounts']['Row'] = {} as unknown as z.infer<typeof Schemas.AccountSchema>;

// Need to find what other schemas exist. Let's see...
