import { z } from 'zod';
import * as schemas from './src/schemas/index.ts';
import type { Tables } from './src/database.types.ts';

// 5. Profiles
type DBProfile = Tables<'profiles'>;
type ZodProfile = z.infer<typeof schemas.ProfileSchema>;
const t9: DBProfile = null as unknown as ZodProfile;
const t10: ZodProfile = null as unknown as DBProfile;

// 6. Sprints
type DBSprint = Tables<'sprints'>;
type ZodSprint = z.infer<typeof schemas.SprintSchema>;
const t11: DBSprint = null as unknown as ZodSprint;
const t12: ZodSprint = null as unknown as DBSprint;

// 7. Projects
type DBProject = Tables<'projects'>;
type ZodProject = z.infer<typeof schemas.ProjectSchema>;
const t13: DBProject = null as unknown as ZodProject;
const t14: ZodProject = null as unknown as DBProject;

// 8. Surveys
type DBSurvey = Tables<'surveys'>;
type ZodSurvey = z.infer<typeof schemas.SurveySchema>;
const t15: DBSurvey = null as unknown as ZodSurvey;
const t16: ZodSurvey = null as unknown as DBSurvey;

// 9. SurveyQuestions
type DBSurveyQuestion = Tables<'survey_questions'>;
type ZodSurveyQuestion = z.infer<typeof schemas.SurveyQuestionSchema>;
const t17: DBSurveyQuestion = null as unknown as ZodSurveyQuestion;
const t18: ZodSurveyQuestion = null as unknown as DBSurveyQuestion;

// 10. SurveyResponses
type DBSurveyResponse = Tables<'survey_responses'>;
type ZodSurveyResponse = z.infer<typeof schemas.SurveyResponseSchema>;
const t19: DBSurveyResponse = null as unknown as ZodSurveyResponse;
const t20: ZodSurveyResponse = null as unknown as DBSurveyResponse;
