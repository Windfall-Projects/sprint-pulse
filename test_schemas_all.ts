import { z } from 'zod';
import * as schemas from './packages/shared/src/schemas/index.ts';
import type { Tables } from './packages/shared/src/database.types.ts';

type DBWorkItem = Tables<'work_items'>;
type ZodWorkItem = z.infer<typeof schemas.WorkItemSchema>;
const t1: DBWorkItem = null as unknown as ZodWorkItem;
const t2: ZodWorkItem = null as unknown as DBWorkItem;

type DBTeam = Tables<'teams'>;
type ZodTeam = z.infer<typeof schemas.TeamSchema>;
const t3: DBTeam = null as unknown as ZodTeam;
const t4: ZodTeam = null as unknown as DBTeam;

type DBTeamMember = Tables<'team_members'>;
type ZodTeamMember = z.infer<typeof schemas.TeamMemberSchema>;
const t5: DBTeamMember = null as unknown as ZodTeamMember;
const t6: ZodTeamMember = null as unknown as DBTeamMember;

type DBAccount = Tables<'accounts'>;
type ZodAccount = z.infer<typeof schemas.AccountSchema>;
const t7: DBAccount = null as unknown as ZodAccount;
const t8: ZodAccount = null as unknown as DBAccount;

type DBProfile = Tables<'profiles'>;
type ZodProfile = z.infer<typeof schemas.ProfileSchema>;
const t9: DBProfile = null as unknown as ZodProfile;
const t10: ZodProfile = null as unknown as DBProfile;

type DBSprint = Tables<'sprints'>;
type ZodSprint = z.infer<typeof schemas.SprintSchema>;
const t11: DBSprint = null as unknown as ZodSprint;
const t12: ZodSprint = null as unknown as DBSprint;

type DBProject = Tables<'projects'>;
type ZodProject = z.infer<typeof schemas.ProjectSchema>;
const t13: DBProject = null as unknown as ZodProject;
const t14: ZodProject = null as unknown as DBProject;

type DBSurvey = Tables<'surveys'>;
type ZodSurvey = z.infer<typeof schemas.SurveySchema>;
const t15: DBSurvey = null as unknown as ZodSurvey;
const t16: ZodSurvey = null as unknown as DBSurvey;

type DBSurveyQuestion = Tables<'survey_questions'>;
type ZodSurveyQuestion = z.infer<typeof schemas.SurveyQuestionSchema>;
const t17: DBSurveyQuestion = null as unknown as ZodSurveyQuestion;
const t18: ZodSurveyQuestion = null as unknown as DBSurveyQuestion;

type DBSurveyResponse = Tables<'survey_responses'>;
type ZodSurveyResponse = z.infer<typeof schemas.SurveyResponseSchema>;
const t19: DBSurveyResponse = null as unknown as ZodSurveyResponse;
const t20: ZodSurveyResponse = null as unknown as DBSurveyResponse;

type DBSurveyAnswer = Tables<'survey_answers'>;
type ZodSurveyAnswer = z.infer<typeof schemas.SurveyAnswerSchema>;
const t21: DBSurveyAnswer = null as unknown as ZodSurveyAnswer;
const t22: ZodSurveyAnswer = null as unknown as DBSurveyAnswer;

type DBKudos = Tables<'kudos'>;
type ZodKudos = z.infer<typeof schemas.KudosSchema>;
const t23: DBKudos = null as unknown as ZodKudos;
const t24: ZodKudos = null as unknown as DBKudos;

type DBSprintCommitment = Tables<'sprint_commitments'>;
type ZodSprintCommitment = z.infer<typeof schemas.SprintCommitmentSchema>;
const t25: DBSprintCommitment = null as unknown as ZodSprintCommitment;
const t26: ZodSprintCommitment = null as unknown as DBSprintCommitment;

type DBSprintSnapshot = Tables<'sprint_snapshots'>;
type ZodSprintSnapshot = z.infer<typeof schemas.SprintSnapshotSchema>;
const t27: DBSprintSnapshot = null as unknown as ZodSprintSnapshot;
const t28: ZodSprintSnapshot = null as unknown as DBSprintSnapshot;

type DBHistoricalMetric = Tables<'historical_metrics'>;
type ZodHistoricalMetric = z.infer<typeof schemas.HistoricalMetricSchema>;
const t29: DBHistoricalMetric = null as unknown as ZodHistoricalMetric;
const t30: ZodHistoricalMetric = null as unknown as DBHistoricalMetric;

type DBIntegration = Tables<'integrations'>;
type ZodIntegration = z.infer<typeof schemas.IntegrationSchema>;
const t31: DBIntegration = null as unknown as ZodIntegration;
const t32: ZodIntegration = null as unknown as DBIntegration;

type DBIntegrationMapping = Tables<'integration_mappings'>;
type ZodIntegrationMapping = z.infer<typeof schemas.IntegrationMappingSchema>;
const t33: DBIntegrationMapping = null as unknown as ZodIntegrationMapping;
const t34: ZodIntegrationMapping = null as unknown as DBIntegrationMapping;
