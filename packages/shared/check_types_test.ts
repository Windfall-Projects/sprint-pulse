
import { z } from 'zod';
import * as schemas from './src/schemas/index';
import type { Database } from './src/database.types';

type PublicSchema = Database['public'];
type Tables = PublicSchema['Tables'];
type Enums = PublicSchema['Enums'];

// Helper to check assignment
function check<T, U>(val: T): U { return val as unknown as U; }
function checkEq<T, U>(v1: T, v2: U): T & U { return null as any; }

// WorkItem check
type WorkItemDB = Tables['work_items']['Row'];
type WorkItemZod = z.infer<typeof schemas.WorkItemSchema>;
const t1: WorkItemDB = null as unknown as WorkItemZod;
const t2: WorkItemZod = null as unknown as WorkItemDB;

// Account check
type AccountDB = Tables['accounts']['Row'];
type AccountZod = z.infer<typeof schemas.AccountSchema>;
const t3: AccountDB = null as unknown as AccountZod;
const t4: AccountZod = null as unknown as AccountDB;

// Profile check
type ProfileDB = Tables['profiles']['Row'];
type ProfileZod = z.infer<typeof schemas.ProfileSchema>;
const t5: ProfileDB = null as unknown as ProfileZod;
const t6: ProfileZod = null as unknown as ProfileDB;

// Team check
type TeamDB = Tables['teams']['Row'];
type TeamZod = z.infer<typeof schemas.TeamSchema>;
const t7: TeamDB = null as unknown as TeamZod;
const t8: TeamZod = null as unknown as TeamDB;

// Sprint check
type SprintDB = Tables['sprints']['Row'];
type SprintZod = z.infer<typeof schemas.SprintSchema>;
const t9: SprintDB = null as unknown as SprintZod;
const t10: SprintZod = null as unknown as SprintDB;

// Project check
type ProjectDB = Tables['projects']['Row'];
type ProjectZod = z.infer<typeof schemas.ProjectSchema>;
const t11: ProjectDB = null as unknown as ProjectZod;
const t12: ProjectZod = null as unknown as ProjectDB;
