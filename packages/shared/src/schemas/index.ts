import { z } from 'zod';

// ============================================================================
// 1. SHARED & ENUMS
// ============================================================================

// Helper for Supabase "Timestamptz" (comes as ISO string)
const Timestamp = z.string().datetime({ offset: true });

/**
 * Standard format: "YYYY-MM-DD". 
 * * @warning Do NOT pass full ISO strings or Date objects here. 
 * These flow directly into Postgres DATE columns.
 */
const DateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)");

export const TeamRoleEnum = z.enum(['member', 'lead']);
export const SprintStatusEnum = z.enum(['planned', 'active', 'completed']);
export const WorkItemTypeEnum = z.enum(['story', 'bug', 'task', 'chore']);
export const WorkItemStatusEnum = z.enum(['todo', 'in_progress', 'review', 'done']);
export const WorkItemProviderEnum = z.enum(['native', 'github', 'jira']);
export const QuestionTypeEnum = z.enum(['scale', 'text', 'boolean']);

// ============================================================================
// 2. IDENTITY (Profiles & Accounts)
// ============================================================================

export const ProfileSchema = z.object({
  user_id: z.string().uuid(),
  display_name: z.string().min(1, "Display name is required").nullable(),
  avatar_url: z.string().url().nullable(),
  created_at: Timestamp,
  updated_at: Timestamp,
});

export const AccountSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  domain: z.string().nullable(),
  is_test_tenant: z.boolean(),
  created_at: Timestamp,
});

// ============================================================================
// 3. ORGANIZATION (Teams)
// ============================================================================

export const TeamSchema = z.object({
  id: z.string().uuid(),
  account_id: z.string().uuid(),
  name: z.string().min(1, "Team name is required"),
  deleted_at: Timestamp.nullable(), // Soft Delete support
  created_at: Timestamp,
  updated_at: Timestamp,
});

export const TeamMemberSchema = z.object({
  id: z.string().uuid(),
  team_id: z.string().uuid(),
  user_id: z.string().uuid(),
  role: TeamRoleEnum,
  joined_at: Timestamp,
});

export const CreateTeamSchema = TeamSchema.omit({
  id: true,
  deleted_at: true,
  created_at: true,
  updated_at: true,
});

// ============================================================================
// 4. EXECUTION (Sprints & Work Items)
// ============================================================================

export const SprintSchema = z.object({
  id: z.string().uuid(),
  team_id: z.string().uuid(),
  name: z.string().min(1, "Sprint name is required"),
  start_date: DateString,
  end_date: DateString,
  goal: z.string().nullable(),
  status: SprintStatusEnum,
  created_at: Timestamp,
  updated_at: Timestamp,
});

/**
 * Input Schema for creating a Sprint.
 * * @remarks
 * - Omits system fields (id, created_at).
 * - Enforces end_date >= start_date.
 * - Use this for React Hook Form resolvers.
 */
export const CreateSprintSchema = SprintSchema.omit({
  id: true,
  created_at: true,
  updated_at: true
}).refine((data) => data.end_date >= data.start_date, {
  message: "End date must be after start date",
  path: ["end_date"],
});

/**
 * Input Schema for updating a Sprint.
 * All fields are optional; enforces end_date >= start_date when both are present.
 */
export const UpdateSprintSchema = SprintSchema.pick({
  name: true,
  start_date: true,
  end_date: true,
  goal: true,
  status: true,
}).partial().refine(
  (data) => {
    if (data.start_date && data.end_date) {
      return data.end_date >= data.start_date;
    }
    return true;
  },
  {
    message: "End date must be after start date",
    path: ["end_date"],
  }
);

export const WorkItemSchema = z.object({
  id: z.string().uuid(),
  sprint_id: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable(),
  story_points: z.number().int().nonnegative().default(0),
  status: WorkItemStatusEnum,
  type: WorkItemTypeEnum,

  // External Integration ("Shadow Records")
  provider: WorkItemProviderEnum,
  external_id: z.string().nullable(),
  external_url: z.string().url().nullable(),

  completed_at: Timestamp.nullable(),
  created_at: Timestamp,
  updated_at: Timestamp,
});

// ============================================================================
// 5. PULSE (Surveys)
// ============================================================================

export const SurveySchema = z.object({
  id: z.string().uuid(),
  team_id: z.string().uuid().nullable(), // Null = System Template
  title: z.string().min(1),
  is_active: z.boolean(),
  is_system_template: z.boolean(),
  created_at: Timestamp,
});

export const SurveyQuestionSchema = z.object({
  id: z.string().uuid(),
  survey_id: z.string().uuid(),
  question_text: z.string().min(1),
  question_type: QuestionTypeEnum,
  order_index: z.number().int(),
  is_required: z.boolean(),
});

/**
 * Input Schema for creating a Survey with its questions.
 * - `account_id` is required by the DB.
 * - `team_id` is nullable (null = system-level / org-wide survey).
 * - `is_active` defaults to true.
 * - `questions` is a nested array of question definitions (no id/survey_id needed).
 */
export const CreateSurveySchema = z.object({
  account_id: z.string().uuid(),
  team_id: z.string().uuid().nullable().optional(),
  title: z.string().min(1),
  is_active: z.boolean().optional().default(true),
  questions: z.array(
    z.object({
      question_text: z.string().min(1),
      question_type: QuestionTypeEnum,
      order_index: z.number().int(),
      is_required: z.boolean().optional().default(true),
    })
  ),
});

export const SurveyResponseSchema = z.object({
  id: z.string().uuid(),
  sprint_id: z.string().uuid(),
  user_id: z.string().uuid(),
  is_confidential: z.boolean(), // Match spec: 'is_confidential'
  completed_at: Timestamp.nullable(),
  created_at: Timestamp,
});

export const SurveyAnswerSchema = z.object({
  id: z.string().uuid(),
  response_id: z.string().uuid(),
  question_id: z.string().uuid(),
  scale_value: z.number().int().min(1).max(5).nullable(),
  text_value: z.string().nullable(),
  boolean_value: z.boolean().nullable(),
});

// ============================================================================
// 6. RECOGNITION (Kudos)
// ============================================================================

export const KudosSchema = z.object({
  id: z.string().uuid(),
  team_id: z.string().uuid(),
  sprint_id: z.string().uuid().nullable(),
  sender_user_id: z.string().uuid(),
  recipient_user_id: z.string().uuid(),
  message: z.string().min(1, "Message cannot be empty"),
  created_at: Timestamp,
});

// Input Schema for giving Kudos
export const GiveKudosSchema = KudosSchema.omit({
  id: true,
  sender_user_id: true, // Inferred from Auth
  created_at: true
});
