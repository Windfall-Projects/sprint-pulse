import { z } from 'zod';
import * as schemas from './src/schemas/index.ts';
import type { Tables } from './src/database.types.ts';

// WorkItems
type DBWorkItem = Tables<'work_items'>;
type ZodWorkItem = z.infer<typeof schemas.WorkItemSchema>;
const m1: Exclude<keyof ZodWorkItem, keyof DBWorkItem> = null as never;
const m2: Exclude<keyof DBWorkItem, keyof ZodWorkItem> = null as never;

// Teams
type DBTeam = Tables<'teams'>;
type ZodTeam = z.infer<typeof schemas.TeamSchema>;
const m3: Exclude<keyof ZodTeam, keyof DBTeam> = null as never;
const m4: Exclude<keyof DBTeam, keyof ZodTeam> = null as never;

// TeamMembers
type DBTeamMember = Tables<'team_members'>;
type ZodTeamMember = z.infer<typeof schemas.TeamMemberSchema>;
const m5: Exclude<keyof ZodTeamMember, keyof DBTeamMember> = null as never;
const m6: Exclude<keyof DBTeamMember, keyof ZodTeamMember> = null as never;

// Accounts
type DBAccount = Tables<'accounts'>;
type ZodAccount = z.infer<typeof schemas.AccountSchema>;
const m7: Exclude<keyof ZodAccount, keyof DBAccount> = null as never;
const m8: Exclude<keyof DBAccount, keyof ZodAccount> = null as never;

// Profiles
type DBProfile = Tables<'profiles'>;
type ZodProfile = z.infer<typeof schemas.ProfileSchema>;
const m9: Exclude<keyof ZodProfile, keyof DBProfile> = null as never;
const m10: Exclude<keyof DBProfile, keyof ZodProfile> = null as never;

// Sprints
type DBSprint = Tables<'sprints'>;
type ZodSprint = z.infer<typeof schemas.SprintSchema>;
const m11: Exclude<keyof ZodSprint, keyof DBSprint> = null as never;
const m12: Exclude<keyof DBSprint, keyof ZodSprint> = null as never;

// Projects
type DBProject = Tables<'projects'>;
type ZodProject = z.infer<typeof schemas.ProjectSchema>;
const m13: Exclude<keyof ZodProject, keyof DBProject> = null as never;
const m14: Exclude<keyof DBProject, keyof ZodProject> = null as never;

// Surveys
type DBSurvey = Tables<'surveys'>;
type ZodSurvey = z.infer<typeof schemas.SurveySchema>;
const m15: Exclude<keyof ZodSurvey, keyof DBSurvey> = null as never;
const m16: Exclude<keyof DBSurvey, keyof ZodSurvey> = null as never;

// SurveyQuestions
type DBSurveyQuestion = Tables<'survey_questions'>;
type ZodSurveyQuestion = z.infer<typeof schemas.SurveyQuestionSchema>;
const m17: Exclude<keyof ZodSurveyQuestion, keyof DBSurveyQuestion> = null as never;
const m18: Exclude<keyof DBSurveyQuestion, keyof ZodSurveyQuestion> = null as never;

// SurveyResponses
type DBSurveyResponse = Tables<'survey_responses'>;
type ZodSurveyResponse = z.infer<typeof schemas.SurveyResponseSchema>;
const m19: Exclude<keyof ZodSurveyResponse, keyof DBSurveyResponse> = null as never;
const m20: Exclude<keyof DBSurveyResponse, keyof ZodSurveyResponse> = null as never;

// SurveyAnswers
type DBSurveyAnswer = Tables<'survey_answers'>;
type ZodSurveyAnswer = z.infer<typeof schemas.SurveyAnswerSchema>;
const m21: Exclude<keyof ZodSurveyAnswer, keyof DBSurveyAnswer> = null as never;
const m22: Exclude<keyof DBSurveyAnswer, keyof ZodSurveyAnswer> = null as never;

// Kudos
type DBKudos = Tables<'kudos'>;
type ZodKudos = z.infer<typeof schemas.KudosSchema>;
const m23: Exclude<keyof ZodKudos, keyof DBKudos> = null as never;
const m24: Exclude<keyof DBKudos, keyof ZodKudos> = null as never;

// SprintCommitments
type DBSprintCommitment = Tables<'sprint_commitments'>;
type ZodSprintCommitment = z.infer<typeof schemas.SprintCommitmentSchema>;
const m25: Exclude<keyof ZodSprintCommitment, keyof DBSprintCommitment> = null as never;
const m26: Exclude<keyof DBSprintCommitment, keyof ZodSprintCommitment> = null as never;

// SprintSnapshots
type DBSprintSnapshot = Tables<'sprint_snapshots'>;
type ZodSprintSnapshot = z.infer<typeof schemas.SprintSnapshotSchema>;
const m27: Exclude<keyof ZodSprintSnapshot, keyof DBSprintSnapshot> = null as never;
const m28: Exclude<keyof DBSprintSnapshot, keyof ZodSprintSnapshot> = null as never;

// HistoricalMetrics
type DBHistoricalMetric = Tables<'historical_metrics'>;
type ZodHistoricalMetric = z.infer<typeof schemas.HistoricalMetricSchema>;
const m29: Exclude<keyof ZodHistoricalMetric, keyof DBHistoricalMetric> = null as never;
const m30: Exclude<keyof DBHistoricalMetric, keyof ZodHistoricalMetric> = null as never;

// Integrations
type DBIntegration = Tables<'integrations'>;
type ZodIntegration = z.infer<typeof schemas.IntegrationSchema>;
const m31: Exclude<keyof ZodIntegration, keyof DBIntegration> = null as never;
const m32: Exclude<keyof DBIntegration, keyof ZodIntegration> = null as never;

// IntegrationMappings
type DBIntegrationMapping = Tables<'integration_mappings'>;
type ZodIntegrationMapping = z.infer<typeof schemas.IntegrationMappingSchema>;
const m33: Exclude<keyof ZodIntegrationMapping, keyof DBIntegrationMapping> = null as never;
const m34: Exclude<keyof DBIntegrationMapping, keyof ZodIntegrationMapping> = null as never;
