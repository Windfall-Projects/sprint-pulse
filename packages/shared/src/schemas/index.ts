import { z } from 'zod';

// ============================================================================
// 1. SHARED & ENUMS
// ============================================================================

// Helper for Supabase "Timestamptz" (comes as ISO string)
export const Timestamp = z.string().datetime({ offset: true });

/**
 * Standard format: "YYYY-MM-DD". 
 * * @warning Do NOT pass full ISO strings or Date objects here. 
 * These flow directly into Postgres DATE columns.
 */
export const DateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)");

export const TeamRoleEnum = z.enum(['lead', 'contributor', 'stakeholder']);
export const SprintStatusEnum = z.enum(['planned', 'active', 'completed']);
export const WorkItemTypeEnum = z.enum(['story', 'bug', 'task', 'chore']);
export const WorkItemStatusEnum = z.enum(['todo', 'in_progress', 'review', 'done']);
export const WorkItemProviderEnum = z.enum(['native', 'github', 'jira']);
export const ProjectStatusEnum = z.enum(['active', 'archived', 'completed']);
export const QuestionTypeEnum = z.enum(['scale', 'text', 'boolean']);

// ============================================================================
// 2. IDENTITY (Profiles & Accounts)
// ============================================================================

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  auth_user_id: z.string().uuid().nullable(),
  display_name: z.string().min(1, "Display name is required").nullable(),
  avatar_url: z.string().url().nullable(),
  created_at: Timestamp,
  updated_at: Timestamp,
});

export const AccountSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  is_test_tenant: z.boolean().nullable(),
  owner_user_id: z.string().uuid(),
  created_at: Timestamp.nullable(),
  updated_at: Timestamp.nullable(),
});

/**
 * Input Schema for updating a Profile.
 * Only `display_name` and `avatar_url` are user-editable.
 */
export const UpdateProfileSchema = ProfileSchema.pick({
  display_name: true,
  avatar_url: true,
}).partial();

/**
 * Input Schema for creating a Virtual Profile.
 * auth_user_id is not included because it's null for virtual profiles.
 * Optionally allows assigning to one or more teams initially.
 */
export const CreateVirtualProfileSchema = z.object({
  display_name: z.string().min(1, "Display name is required"),
  avatar_url: z.string().url().nullable().optional(),
  team_ids: z.array(z.string().uuid()).optional(),
});

/**
 * Input Schema for updating a Virtual Profile.
 */
export const UpdateVirtualProfileSchema = CreateVirtualProfileSchema.pick({
  display_name: true,
  avatar_url: true,
}).partial();

/**
 * Input Schema for creating an Account.
 * `owner_user_id` is inferred server-side from the authenticated user.
 */
export const CreateAccountSchema = z.object({
  name: z.string().min(1, "Account name is required"),
  slug: z.string().min(1, "Slug is required"),
});

/**
 * Input Schema for updating an Account.
 * Only `name` is safely editable (slug changes could break external references).
 */
export const UpdateAccountSchema = z.object({
  name: z.string().min(1, "Account name is required"),
}).partial();

export const AccountMemberRoleEnum = z.enum(['owner', 'admin', 'member']);

export const AccountMemberSchema = z.object({
  account_id: z.string().uuid(),
  user_id: z.string().uuid(),
  role: AccountMemberRoleEnum,
  created_at: Timestamp,
});

/**
 * Input Schema for joining an Account.
 * `user_id` is inferred server-side from auth; `account_id` is in the body.
 * RLS enforces that users can only add themselves.
 */
export const JoinAccountSchema = z.object({
  account_id: z.string().uuid(),
  role: AccountMemberRoleEnum,
});

// ============================================================================
// 3. ORGANIZATION (Teams)
// ============================================================================

export const TeamSchema = z.object({
  id: z.string().uuid(),
  account_id: z.string().uuid(),
  name: z.string().min(1, "Team name is required"),
  description: z.string().nullable(),
  deleted_at: Timestamp.nullable(), // Soft Delete support
  created_at: Timestamp.nullable(),
  updated_at: Timestamp.nullable(),
});

export const TeamMemberSchema = z.object({
  team_id: z.string().uuid(),
  profile_id: z.string().uuid(),
  role: TeamRoleEnum,
  title: z.string().nullable(),
  joined_at: Timestamp,
});

export const CreateTeamSchema = TeamSchema.omit({
  id: true,
  deleted_at: true,
  created_at: true,
  updated_at: true,
});

/**
 * Input Schema for adding a member to a team.
 */
export const CreateTeamMemberSchema = z.object({
  team_id: z.string().uuid(),
  profile_id: z.string().uuid(),
  role: TeamRoleEnum.default('contributor'),
  title: z.string().nullable().optional(),
});

/**
 * Input Schema for updating a team member's role or title.
 */
export const UpdateTeamMemberSchema = z.object({
  role: TeamRoleEnum,
  title: z.string().nullable(),
}).partial();

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

export const ProjectSchema = z.object({
  id: z.string().uuid(),
  team_id: z.string().uuid(),
  name: z.string().min(1, "Project name is required"),
  description: z.string().nullable(),
  status: ProjectStatusEnum,
  created_at: Timestamp,
  updated_at: Timestamp,
});

export const CreateProjectSchema = z.object({
  team_id: z.string().uuid(),
  name: z.string().min(1, "Project name is required"),
  description: z.string().nullable().optional(),
});

export const UpdateProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().nullable(),
  status: ProjectStatusEnum,
}).partial();

export const WorkItemSchema = z.object({
  id: z.string().uuid(),
  team_id: z.string().uuid(),
  account_id: z.string().uuid(),
  sprint_id: z.string().uuid().nullable(),
  assignee_profile_id: z.string().uuid().nullable(),
  project_id: z.string().uuid().nullable(),
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

/**
 * Input Schema for creating a Work Item.
 * `account_id` is resolved server-side from the team's account.
 */
export const CreateWorkItemSchema = z.object({
  team_id: z.string().uuid(),
  sprint_id: z.string().uuid().nullable().optional(),
  assignee_profile_id: z.string().uuid().nullable().optional(),
  project_id: z.string().uuid().nullable().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  story_points: z.number().int().nonnegative().default(0),
  type: WorkItemTypeEnum.default('story'),
  provider: WorkItemProviderEnum.default('native'),
  external_id: z.string().nullable().optional(),
  external_url: z.string().url().nullable().optional(),
});

/**
 * Input Schema for updating a Work Item.
 * All fields optional. `team_id` and `account_id` are immutable.
 */
export const UpdateWorkItemSchema = z.object({
  sprint_id: z.string().uuid().nullable(),
  assignee_profile_id: z.string().uuid().nullable(),
  project_id: z.string().uuid().nullable(),
  title: z.string().min(1, "Title is required"),
  description: z.string().nullable(),
  story_points: z.number().int().nonnegative(),
  status: WorkItemStatusEnum,
  type: WorkItemTypeEnum,
  external_id: z.string().nullable(),
  external_url: z.string().url().nullable(),
}).partial();

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
  survey_id: z.string().uuid(),
  sprint_id: z.string().uuid(),
  responder_profile_id: z.string().uuid(),
  is_confidential: z.boolean(),
  created_at: Timestamp,
});

export const SurveyAnswerSchema = z.object({
  id: z.string().uuid(),
  response_id: z.string().uuid(),
  question_id: z.string().uuid(),
  value_text: z.string().nullable(),
  value_number: z.number().int().nullable(),
  value_json: z.unknown().nullable(),
});

/**
 * Input Schema for submitting a survey response with answers.
 * `user_id` is inferred server-side from auth.
 */
export const SubmitSurveyResponseSchema = z.object({
  survey_id: z.string().uuid(),
  sprint_id: z.string().uuid(),
  is_confidential: z.boolean().optional().default(false),
  answers: z.array(
    z.object({
      question_id: z.string().uuid(),
      value_text: z.string().nullable().optional(),
      value_number: z.number().int().nullable().optional(),
      value_json: z.unknown().nullable().optional(),
    })
  ),
});

// ============================================================================
// 6. RECOGNITION (Kudos)
// ============================================================================

export const KudosCategoryEnum = z.enum(['unblock', 'support', 'technical_win', 'team_spirit']);

export const KudosSchema = z.object({
  id: z.string().uuid(),
  team_id: z.string().uuid().nullable(),
  sprint_id: z.string().uuid().nullable(),
  account_id: z.string().uuid(),
  sender_profile_id: z.string().uuid().nullable(),
  receiver_profile_id: z.string().uuid().nullable(),
  message: z.string().min(1, "Message cannot be empty"),
  category: KudosCategoryEnum.nullable(),
  created_at: Timestamp.nullable(),
});

// Input Schema for giving Kudos
export const GiveKudosSchema = KudosSchema.omit({
  id: true,
  account_id: true,       // Resolved from team
  sender_profile_id: true,   // Inferred from Auth
  created_at: true,
});

// ============================================================================
// 7. SPRINT ANALYTICS & METRICS
// ============================================================================

export const SprintCommitmentSchema = z.object({
  id: z.string().uuid(),
  sprint_id: z.string().uuid(),

  profile_id: z.string().uuid().nullable(),
  committed_points: z.number().int().default(0),
  committed_items: z.number().int().default(0),
  created_at: Timestamp,
});

export const CreateSprintCommitmentSchema = z.object({
  sprint_id: z.string().uuid(),
  profile_id: z.string().uuid().nullable().optional(),
  committed_points: z.number().int().default(0),
  committed_items: z.number().int().default(0),
});

export const SprintSnapshotSchema = z.object({
  id: z.string().uuid(),
  sprint_id: z.string().uuid(),
  profile_id: z.string().uuid().nullable(),
  snapshot_date: DateString,
  points_completed: z.number().int().default(0),
  points_remaining: z.number().int().default(0),
  items_completed: z.number().int().default(0),
  items_remaining: z.number().int().default(0),
  created_at: Timestamp,
});

export const CreateSprintSnapshotSchema = z.object({
  sprint_id: z.string().uuid(),
  profile_id: z.string().uuid().nullable().optional(),
  snapshot_date: DateString.optional(),
  points_completed: z.number().int().default(0),
  points_remaining: z.number().int().default(0),
  items_completed: z.number().int().default(0),
  items_remaining: z.number().int().default(0),
});

export const HistoricalMetricSchema = z.object({
  id: z.string().uuid(),
  team_id: z.string().uuid(),
  profile_id: z.string().uuid().nullable(),
  metric_date: DateString,
  import_batch_id: z.string().nullable(),
  velocity_avg: z.number().nullable(),
  last_sprint_points_completed: z.number().int().nullable(),
  last_sprint_items_completed: z.number().int().nullable(),
  last_sprint_points_incomplete: z.number().int().nullable(),
  last_sprint_items_incomplete: z.number().int().nullable(),
  satisfaction_score: z.number().int().min(1).max(5).nullable(),
  flow_score: z.number().int().min(1).max(5).nullable(),
  friction_score: z.number().int().min(1).max(5).nullable(),
  safety_score: z.number().int().min(1).max(5).nullable(),
  workload_balance_score: z.number().int().min(1).max(5).nullable(),
  requirement_clarity_score: z.number().int().min(1).max(5).nullable(),
  support_score: z.number().int().min(1).max(5).nullable(),
  custom_soft_metrics: z.record(z.unknown()).nullable(),
  created_at: Timestamp,
});

/**
 * Input Schema for importing historical metrics.
 * All metric fields are optional since not all imports have all data.
 */
export const CreateHistoricalMetricSchema = HistoricalMetricSchema.omit({
  id: true,
  created_at: true,
});

// ============================================================================
// 8. INTEGRATIONS
// ============================================================================

export const IntegrationProviderEnum = z.enum(['github']);

export const IntegrationSchema = z.object({
  id: z.string().uuid(),
  account_id: z.string().uuid(),
  provider: IntegrationProviderEnum,
  installation_id: z.string().nullable(),
  created_at: Timestamp,
  updated_at: Timestamp,
});

export const CreateIntegrationSchema = z.object({
  account_id: z.string().uuid(),
  provider: IntegrationProviderEnum,
  installation_id: z.string().nullable().optional(),
});

export const IntegrationMappingSchema = z.object({
  id: z.string().uuid(),
  integration_id: z.string().uuid(),
  external_repo_id: z.string().min(1),
  team_id: z.string().uuid(),
  project_id: z.string().uuid().nullable(),
  is_active: z.boolean(),
  created_at: Timestamp,
  updated_at: Timestamp,
});

export const CreateIntegrationMappingSchema = z.object({
  integration_id: z.string().uuid(),
  external_repo_id: z.string().min(1),
  team_id: z.string().uuid(),
  project_id: z.string().uuid().nullable().optional(),
  is_active: z.boolean().optional().default(true),
});

export const UpdateIntegrationMappingSchema = z.object({
  team_id: z.string().uuid(),
  project_id: z.string().uuid().nullable(),
  is_active: z.boolean(),
}).partial();
