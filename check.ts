import { z } from 'zod';
import { Database } from './packages/shared/src/database.types';
import * as schemas from './packages/shared/src/schemas/index';

type DB = Database['public'];

const t1: DB['Tables']['profiles']['Row'] = {} as unknown as z.infer<typeof schemas.ProfileSchema>;
const t2: z.infer<typeof schemas.ProfileSchema> = {} as unknown as DB['Tables']['profiles']['Row'];

const t3: DB['Tables']['accounts']['Row'] = {} as unknown as z.infer<typeof schemas.AccountSchema>;
const t4: z.infer<typeof schemas.AccountSchema> = {} as unknown as DB['Tables']['accounts']['Row'];

const t5: DB['Tables']['teams']['Row'] = {} as unknown as z.infer<typeof schemas.TeamSchema>;
const t6: z.infer<typeof schemas.TeamSchema> = {} as unknown as DB['Tables']['teams']['Row'];

const t7: DB['Tables']['sprints']['Row'] = {} as unknown as z.infer<typeof schemas.SprintSchema>;
const t8: z.infer<typeof schemas.SprintSchema> = {} as unknown as DB['Tables']['sprints']['Row'];

const t9: DB['Tables']['projects']['Row'] = {} as unknown as z.infer<typeof schemas.ProjectSchema>;
const t10: z.infer<typeof schemas.ProjectSchema> = {} as unknown as DB['Tables']['projects']['Row'];

const t11: DB['Tables']['work_items']['Row'] = {} as unknown as z.infer<typeof schemas.WorkItemSchema>;
const t12: z.infer<typeof schemas.WorkItemSchema> = {} as unknown as DB['Tables']['work_items']['Row'];
