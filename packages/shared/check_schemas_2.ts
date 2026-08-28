import { z } from 'zod';
import * as schemas from './src/schemas/index.ts';
import type { Tables } from './src/database.types.ts';

// 1. WorkItems
type DBWorkItem = Tables<'work_items'>;
type ZodWorkItem = z.infer<typeof schemas.WorkItemSchema>;
const t1: DBWorkItem = null as unknown as ZodWorkItem;
const t2: ZodWorkItem = null as unknown as DBWorkItem;

// 2. Teams
type DBTeam = Tables<'teams'>;
type ZodTeam = z.infer<typeof schemas.TeamSchema>;
const t3: DBTeam = null as unknown as ZodTeam;
const t4: ZodTeam = null as unknown as DBTeam;

// 3. TeamMembers
type DBTeamMember = Tables<'team_members'>;
type ZodTeamMember = z.infer<typeof schemas.TeamMemberSchema>;
const t5: DBTeamMember = null as unknown as ZodTeamMember;
const t6: ZodTeamMember = null as unknown as DBTeamMember;

// 4. Accounts
type DBAccount = Tables<'accounts'>;
type ZodAccount = z.infer<typeof schemas.AccountSchema>;
const t7: DBAccount = null as unknown as ZodAccount;
const t8: ZodAccount = null as unknown as DBAccount;
