import { z } from 'zod';
import * as schemas from './src/schemas/index.ts';
import type { Tables } from './src/database.types.ts';

type Exclude<T, U> = T extends U ? never : T;

const m33: Exclude<keyof z.infer<typeof schemas.SurveySchema>, keyof Tables<'surveys'>> = null as never;
const m34: Exclude<keyof Tables<'surveys'>, keyof z.infer<typeof schemas.SurveySchema>> = null as never;
