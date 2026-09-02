import { z } from 'zod';
import { Database } from './src/database.types.js';
import { AccountSchema, TeamSchema, KudosSchema } from './src/schemas/index.js';

type AccountRow = Database['public']['Tables']['accounts']['Row'];
type TeamRow = Database['public']['Tables']['teams']['Row'];
type KudosRow = Database['public']['Tables']['kudos']['Row'];

const t1: AccountRow = null as unknown as z.infer<typeof AccountSchema>;
const t2: z.infer<typeof AccountSchema> = null as unknown as AccountRow;

const t3: TeamRow = null as unknown as z.infer<typeof TeamSchema>;
const t4: z.infer<typeof TeamSchema> = null as unknown as TeamRow;

const t5: KudosRow = null as unknown as z.infer<typeof KudosSchema>;
const t6: z.infer<typeof KudosSchema> = null as unknown as KudosRow;
