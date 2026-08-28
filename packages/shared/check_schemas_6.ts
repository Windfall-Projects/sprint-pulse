import { z } from 'zod';
import * as schemas from './src/schemas/index.ts';
import type { Tables } from './src/database.types.ts';

type Exclude<T, U> = T extends U ? never : T;

const missing1: Exclude<keyof z.infer<typeof schemas.WorkItemSchema>, keyof Tables<'work_items'>> = null as never;
const missing2: Exclude<keyof Tables<'work_items'>, keyof z.infer<typeof schemas.WorkItemSchema>> = null as never;

const missing3: Exclude<keyof z.infer<typeof schemas.TeamSchema>, keyof Tables<'teams'>> = null as never;
const missing4: Exclude<keyof Tables<'teams'>, keyof z.infer<typeof schemas.TeamSchema>> = null as never;

const missing5: Exclude<keyof z.infer<typeof schemas.TeamMemberSchema>, keyof Tables<'team_members'>> = null as never;
const missing6: Exclude<keyof Tables<'team_members'>, keyof z.infer<typeof schemas.TeamMemberSchema>> = null as never;

const missing7: Exclude<keyof z.infer<typeof schemas.AccountSchema>, keyof Tables<'accounts'>> = null as never;
const missing8: Exclude<keyof Tables<'accounts'>, keyof z.infer<typeof schemas.AccountSchema>> = null as never;

const missing9: Exclude<keyof z.infer<typeof schemas.ProfileSchema>, keyof Tables<'profiles'>> = null as never;
const missing10: Exclude<keyof Tables<'profiles'>, keyof z.infer<typeof schemas.ProfileSchema>> = null as never;

const missing11: Exclude<keyof z.infer<typeof schemas.SprintSchema>, keyof Tables<'sprints'>> = null as never;
const missing12: Exclude<keyof Tables<'sprints'>, keyof z.infer<typeof schemas.SprintSchema>> = null as never;

const missing13: Exclude<keyof z.infer<typeof schemas.ProjectSchema>, keyof Tables<'projects'>> = null as never;
const missing14: Exclude<keyof Tables<'projects'>, keyof z.infer<typeof schemas.ProjectSchema>> = null as never;

const missing15: Exclude<keyof z.infer<typeof schemas.SurveySchema>, keyof Tables<'surveys'>> = null as never;
const missing16: Exclude<keyof Tables<'surveys'>, keyof z.infer<typeof schemas.SurveySchema>> = null as never;

const missing17: Exclude<keyof z.infer<typeof schemas.SurveyQuestionSchema>, keyof Tables<'survey_questions'>> = null as never;
const missing18: Exclude<keyof Tables<'survey_questions'>, keyof z.infer<typeof schemas.SurveyQuestionSchema>> = null as never;

const missing19: Exclude<keyof z.infer<typeof schemas.SurveyResponseSchema>, keyof Tables<'survey_responses'>> = null as never;
const missing20: Exclude<keyof Tables<'survey_responses'>, keyof z.infer<typeof schemas.SurveyResponseSchema>> = null as never;

const missing21: Exclude<keyof z.infer<typeof schemas.SurveyAnswerSchema>, keyof Tables<'survey_answers'>> = null as never;
const missing22: Exclude<keyof Tables<'survey_answers'>, keyof z.infer<typeof schemas.SurveyAnswerSchema>> = null as never;

const missing23: Exclude<keyof z.infer<typeof schemas.KudosSchema>, keyof Tables<'kudos'>> = null as never;
const missing24: Exclude<keyof Tables<'kudos'>, keyof z.infer<typeof schemas.KudosSchema>> = null as never;

const missing25: Exclude<keyof z.infer<typeof schemas.SprintCommitmentSchema>, keyof Tables<'sprint_commitments'>> = null as never;
const missing26: Exclude<keyof Tables<'sprint_commitments'>, keyof z.infer<typeof schemas.SprintCommitmentSchema>> = null as never;

const missing27: Exclude<keyof z.infer<typeof schemas.SprintSnapshotSchema>, keyof Tables<'sprint_snapshots'>> = null as never;
const missing28: Exclude<keyof Tables<'sprint_snapshots'>, keyof z.infer<typeof schemas.SprintSnapshotSchema>> = null as never;

const missing29: Exclude<keyof z.infer<typeof schemas.HistoricalMetricSchema>, keyof Tables<'historical_metrics'>> = null as never;
const missing30: Exclude<keyof Tables<'historical_metrics'>, keyof z.infer<typeof schemas.HistoricalMetricSchema>> = null as never;

const missing31: Exclude<keyof z.infer<typeof schemas.IntegrationSchema>, keyof Tables<'integrations'>> = null as never;
const missing32: Exclude<keyof Tables<'integrations'>, keyof z.infer<typeof schemas.IntegrationSchema>> = null as never;

const missing33: Exclude<keyof z.infer<typeof schemas.IntegrationMappingSchema>, keyof Tables<'integration_mappings'>> = null as never;
const missing34: Exclude<keyof Tables<'integration_mappings'>, keyof z.infer<typeof schemas.IntegrationMappingSchema>> = null as never;
