import { z } from 'zod';
import * as schemas from './packages/shared/src/schemas/index';
import type { Database } from './packages/shared/src/database.types';

type PublicTables = Database['public']['Tables'];

type ExtractRow<TableName extends keyof PublicTables> = PublicTables[TableName]['Row'];

type Expect<T extends true> = T;
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends (<T>() => T extends Y ? 1 : 2) ? true : false;

// We check if ProfileSchema inferred type equals Database['public']['Tables']['profiles']['Row']
type ProfileEqual = Expect<Equal<z.infer<typeof schemas.ProfileSchema>, ExtractRow<'profiles'>>>;
type AccountEqual = Expect<Equal<z.infer<typeof schemas.AccountSchema>, ExtractRow<'accounts'>>>;
type AccountMemberEqual = Expect<Equal<z.infer<typeof schemas.AccountMemberSchema>, ExtractRow<'account_members'>>>;
type TeamEqual = Expect<Equal<z.infer<typeof schemas.TeamSchema>, ExtractRow<'teams'>>>;
type TeamMemberEqual = Expect<Equal<z.infer<typeof schemas.TeamMemberSchema>, ExtractRow<'team_members'>>>;
type ProjectEqual = Expect<Equal<z.infer<typeof schemas.ProjectSchema>, ExtractRow<'projects'>>>;
type SprintEqual = Expect<Equal<z.infer<typeof schemas.SprintSchema>, ExtractRow<'sprints'>>>;
type WorkItemEqual = Expect<Equal<z.infer<typeof schemas.WorkItemSchema>, ExtractRow<'work_items'>>>;
type SprintWorkItemEqual = Expect<Equal<z.infer<typeof schemas.SprintWorkItemSchema>, ExtractRow<'sprint_work_items'>>>;
type QuestionEqual = Expect<Equal<z.infer<typeof schemas.QuestionSchema>, ExtractRow<'questions'>>>;
type SurveyEqual = Expect<Equal<z.infer<typeof schemas.SurveySchema>, ExtractRow<'surveys'>>>;
type SurveyQuestionEqual = Expect<Equal<z.infer<typeof schemas.SurveyQuestionSchema>, ExtractRow<'survey_questions'>>>;
type SurveyResponseEqual = Expect<Equal<z.infer<typeof schemas.SurveyResponseSchema>, ExtractRow<'survey_responses'>>>;
type AnswerEqual = Expect<Equal<z.infer<typeof schemas.AnswerSchema>, ExtractRow<'answers'>>>;
type KudosEqual = Expect<Equal<z.infer<typeof schemas.KudosSchema>, ExtractRow<'kudos'>>>;

console.log('Test file created');
