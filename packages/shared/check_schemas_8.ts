import { z } from 'zod';
import * as schemas from './src/schemas/index.ts';
import type { Tables } from './src/database.types.ts';

type Exclude<T, U> = T extends U ? never : T;

const m33: Exclude<keyof z.infer<typeof schemas.SurveySchema>, keyof Tables<'surveys'>> = null as never;
const m34: Exclude<keyof Tables<'surveys'>, keyof z.infer<typeof schemas.SurveySchema>> = null as never;

const m35: Exclude<keyof z.infer<typeof schemas.AccountSchema>, keyof Tables<'accounts'>> = null as never;
const m36: Exclude<keyof Tables<'accounts'>, keyof z.infer<typeof schemas.AccountSchema>> = null as never;

const m37: Exclude<keyof z.infer<typeof schemas.SurveyQuestionSchema>, keyof Tables<'survey_questions'>> = null as never;
const m38: Exclude<keyof Tables<'survey_questions'>, keyof z.infer<typeof schemas.SurveyQuestionSchema>> = null as never;
