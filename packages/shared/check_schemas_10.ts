import { z } from 'zod';
import * as schemas from './src/schemas/index.ts';
import type { Tables } from './src/database.types.ts';

type Exclude<T, U> = T extends U ? never : T;

// WorkItems
const m1: Exclude<keyof z.infer<typeof schemas.WorkItemSchema>, keyof Tables<'work_items'>> = null as never;
const m2: Exclude<keyof Tables<'work_items'>, keyof z.infer<typeof schemas.WorkItemSchema>> = null as never;

// Teams
const m3: Exclude<keyof z.infer<typeof schemas.TeamSchema>, keyof Tables<'teams'>> = null as never;
const m4: Exclude<keyof Tables<'teams'>, keyof z.infer<typeof schemas.TeamSchema>> = null as never;

// TeamMembers
const m5: Exclude<keyof z.infer<typeof schemas.TeamMemberSchema>, keyof Tables<'team_members'>> = null as never;
const m6: Exclude<keyof Tables<'team_members'>, keyof z.infer<typeof schemas.TeamMemberSchema>> = null as never;

// Accounts
const m7: Exclude<keyof z.infer<typeof schemas.AccountSchema>, keyof Tables<'accounts'>> = null as never;
const m8: Exclude<keyof Tables<'accounts'>, keyof z.infer<typeof schemas.AccountSchema>> = null as never;

// Profiles
const m9: Exclude<keyof z.infer<typeof schemas.ProfileSchema>, keyof Tables<'profiles'>> = null as never;
const m10: Exclude<keyof Tables<'profiles'>, keyof z.infer<typeof schemas.ProfileSchema>> = null as never;

// Sprints
const m11: Exclude<keyof z.infer<typeof schemas.SprintSchema>, keyof Tables<'sprints'>> = null as never;
const m12: Exclude<keyof Tables<'sprints'>, keyof z.infer<typeof schemas.SprintSchema>> = null as never;

// Projects
const m13: Exclude<keyof z.infer<typeof schemas.ProjectSchema>, keyof Tables<'projects'>> = null as never;
const m14: Exclude<keyof Tables<'projects'>, keyof z.infer<typeof schemas.ProjectSchema>> = null as never;

// Surveys
const m15: Exclude<keyof z.infer<typeof schemas.SurveySchema>, keyof Tables<'surveys'>> = null as never;
const m16: Exclude<keyof Tables<'surveys'>, keyof z.infer<typeof schemas.SurveySchema>> = null as never;

// SurveyQuestions
const m17: Exclude<keyof z.infer<typeof schemas.SurveyQuestionSchema>, keyof Tables<'survey_questions'>> = null as never;
const m18: Exclude<keyof Tables<'survey_questions'>, keyof z.infer<typeof schemas.SurveyQuestionSchema>> = null as never;

// SurveyResponses
const m19: Exclude<keyof z.infer<typeof schemas.SurveyResponseSchema>, keyof Tables<'survey_responses'>> = null as never;
const m20: Exclude<keyof Tables<'survey_responses'>, keyof z.infer<typeof schemas.SurveyResponseSchema>> = null as never;

// SurveyAnswers
const m21: Exclude<keyof z.infer<typeof schemas.SurveyAnswerSchema>, keyof Tables<'survey_answers'>> = null as never;
const m22: Exclude<keyof Tables<'survey_answers'>, keyof z.infer<typeof schemas.SurveyAnswerSchema>> = null as never;

// Kudos
const m23: Exclude<keyof z.infer<typeof schemas.KudosSchema>, keyof Tables<'kudos'>> = null as never;
const m24: Exclude<keyof Tables<'kudos'>, keyof z.infer<typeof schemas.KudosSchema>> = null as never;

// SprintCommitments
const m25: Exclude<keyof z.infer<typeof schemas.SprintCommitmentSchema>, keyof Tables<'sprint_commitments'>> = null as never;
const m26: Exclude<keyof Tables<'sprint_commitments'>, keyof z.infer<typeof schemas.SprintCommitmentSchema>> = null as never;

// SprintSnapshots
const m27: Exclude<keyof z.infer<typeof schemas.SprintSnapshotSchema>, keyof Tables<'sprint_snapshots'>> = null as never;
const m28: Exclude<keyof Tables<'sprint_snapshots'>, keyof z.infer<typeof schemas.SprintSnapshotSchema>> = null as never;

// HistoricalMetrics
const m29: Exclude<keyof z.infer<typeof schemas.HistoricalMetricSchema>, keyof Tables<'historical_metrics'>> = null as never;
const m30: Exclude<keyof Tables<'historical_metrics'>, keyof z.infer<typeof schemas.HistoricalMetricSchema>> = null as never;

// Integrations
const m31: Exclude<keyof z.infer<typeof schemas.IntegrationSchema>, keyof Tables<'integrations'>> = null as never;
const m32: Exclude<keyof Tables<'integrations'>, keyof z.infer<typeof schemas.IntegrationSchema>> = null as never;

// IntegrationMappings
const m33: Exclude<keyof z.infer<typeof schemas.IntegrationMappingSchema>, keyof Tables<'integration_mappings'>> = null as never;
const m34: Exclude<keyof Tables<'integration_mappings'>, keyof z.infer<typeof schemas.IntegrationMappingSchema>> = null as never;
