import { z } from 'zod';
import { ProfileSchema } from './packages/shared/src/schemas/index';

type Profile = z.infer<typeof ProfileSchema>;
// just dummy to check
