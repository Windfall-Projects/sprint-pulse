import { describe, it, expect } from 'vitest';
import {
    // Shared & Enums
    Timestamp,
    DateString,
    TeamRoleEnum,
    SprintStatusEnum,
    WorkItemTypeEnum,
    WorkItemStatusEnum,
    WorkItemProviderEnum,
    ProjectStatusEnum,
    QuestionTypeEnum,
    AccountMemberRoleEnum,
    KudosCategoryEnum,

    // Identity
    ProfileSchema,
    AccountSchema,
    UpdateProfileSchema,
    CreateAccountSchema,
    UpdateAccountSchema,
    AccountMemberSchema,
    JoinAccountSchema,

    // Organization
    TeamSchema,
    TeamMemberSchema,
    CreateTeamSchema,
    CreateTeamMemberSchema,
    UpdateTeamMemberSchema,

    // Sprints
    SprintSchema,
    CreateSprintSchema,
    UpdateSprintSchema,

    // Projects
    ProjectSchema,
    CreateProjectSchema,
    UpdateProjectSchema,

    // Work Items
    WorkItemSchema,
    CreateWorkItemSchema,
    UpdateWorkItemSchema,

    // Surveys
    SurveySchema,
    SurveyQuestionSchema,
    CreateSurveySchema,
    SurveyResponseSchema,
    SurveyAnswerSchema,
    SubmitSurveyResponseSchema,

    // Kudos
    KudosSchema,
    GiveKudosSchema,

    // Sprint Analytics
    SprintCommitmentSchema,
    CreateSprintCommitmentSchema,
    SprintSnapshotSchema,
    CreateSprintSnapshotSchema,
    HistoricalMetricSchema,
    CreateHistoricalMetricSchema,
} from './index.js';

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------
const UUID = '123e4567-e89b-12d3-a456-426614174000';
const UUID2 = '223e4567-e89b-12d3-a456-426614174001';
const ISO_TS = '2025-06-15T12:00:00+00:00';

// ============================================================================
// 1. SHARED & ENUMS
// ============================================================================

describe('1 · Shared & Enums', () => {

    describe('Timestamp', () => {
        it('accepts valid ISO-8601 with offset', () => {
            expect(Timestamp.safeParse('2025-01-01T00:00:00+00:00').success).toBe(true);
            expect(Timestamp.safeParse('2025-06-15T08:30:00-05:00').success).toBe(true);
        });
        it('rejects plain date strings', () => {
            expect(Timestamp.safeParse('2025-01-01').success).toBe(false);
        });
        it('rejects arbitrary text', () => {
            expect(Timestamp.safeParse('not-a-date').success).toBe(false);
        });
    });

    describe('DateString', () => {
        it('accepts YYYY-MM-DD', () => {
            expect(DateString.safeParse('2025-06-15').success).toBe(true);
            expect(DateString.safeParse('2024-02-29').success).toBe(true);
        });
        it('rejects other date formats', () => {
            expect(DateString.safeParse('06/15/2025').success).toBe(false);
            expect(DateString.safeParse('15-06-2025').success).toBe(false);
        });
        it('rejects full ISO strings', () => {
            expect(DateString.safeParse('2025-06-15T00:00:00Z').success).toBe(false);
        });
    });

    describe('Enums', () => {
        const cases: [string, ReturnType<typeof import('zod').z.enum>, string[], string[]][] = [
            ['TeamRoleEnum', TeamRoleEnum, ['lead', 'contributor', 'stakeholder'], ['admin', 'manager']],
            ['SprintStatusEnum', SprintStatusEnum, ['planned', 'active', 'completed'], ['draft', 'cancelled']],
            ['WorkItemTypeEnum', WorkItemTypeEnum, ['story', 'bug', 'task', 'chore'], ['epic', 'spike']],
            ['WorkItemStatusEnum', WorkItemStatusEnum, ['todo', 'in_progress', 'review', 'done'], ['archived', 'blocked']],
            ['WorkItemProviderEnum', WorkItemProviderEnum, ['native', 'github', 'jira'], ['gitlab', 'azure']],
            ['ProjectStatusEnum', ProjectStatusEnum, ['active', 'archived', 'completed'], ['draft', 'paused']],
            ['QuestionTypeEnum', QuestionTypeEnum, ['scale', 'text', 'boolean'], ['rating', 'multi']],
            ['AccountMemberRoleEnum', AccountMemberRoleEnum, ['owner', 'admin', 'member'], ['superadmin', 'guest']],
            ['KudosCategoryEnum', KudosCategoryEnum, ['unblock', 'support', 'technical_win', 'team_spirit'], ['kudos', 'praise']],
        ];

        it.each(cases)('%s accepts valid values', (_name, schema, valid, _invalid) => {
            valid.forEach(v => expect(schema.safeParse(v).success).toBe(true));
        });

        it.each(cases)('%s rejects invalid values', (_name, schema, _valid, invalid) => {
            invalid.forEach(v => expect(schema.safeParse(v).success).toBe(false));
        });
    });
});

// ============================================================================
// 2. IDENTITY
// ============================================================================

describe('2 · Identity', () => {

    const validProfile = {
        id: UUID,
        auth_user_id: UUID,
        display_name: 'Alice',
        avatar_url: 'https://example.com/avatar.png',
        created_at: ISO_TS,
        updated_at: ISO_TS,
    };

    describe('ProfileSchema', () => {
        it('accepts valid profile', () => {
            expect(ProfileSchema.safeParse(validProfile).success).toBe(true);
        });
        it('accepts null for nullable fields', () => {
            const p = { ...validProfile, auth_user_id: null, display_name: null, avatar_url: null };
            expect(ProfileSchema.safeParse(p).success).toBe(true);
        });
        it('rejects invalid uuid', () => {
            expect(ProfileSchema.safeParse({ ...validProfile, id: 'bad' }).success).toBe(false);
        });
        it('rejects invalid avatar_url', () => {
            expect(ProfileSchema.safeParse({ ...validProfile, avatar_url: 'not-a-url' }).success).toBe(false);
        });
    });

    describe('UpdateProfileSchema', () => {
        it('accepts partial update (display_name only)', () => {
            expect(UpdateProfileSchema.safeParse({ display_name: 'Bob' }).success).toBe(true);
        });
        it('accepts empty object (all optional)', () => {
            expect(UpdateProfileSchema.safeParse({}).success).toBe(true);
        });
        it('strips unknown keys', () => {
            const result = UpdateProfileSchema.safeParse({ id: UUID, display_name: 'X' });
            expect(result.success).toBe(true);
            if (result.success) expect(result.data).not.toHaveProperty('id');
        });
    });

    describe('AccountSchema', () => {
        const validAccount = {
            id: UUID,
            name: 'Acme Corp',
            slug: 'acme-corp',
            is_test_tenant: false,
            owner_user_id: UUID,
            created_at: ISO_TS,
            updated_at: ISO_TS,
        };
        it('accepts valid account', () => {
            expect(AccountSchema.safeParse(validAccount).success).toBe(true);
        });
        it('rejects empty name', () => {
            expect(AccountSchema.safeParse({ ...validAccount, name: '' }).success).toBe(false);
        });
    });

    describe('CreateAccountSchema', () => {
        it('accepts valid input', () => {
            expect(CreateAccountSchema.safeParse({ name: 'Acme', slug: 'acme' }).success).toBe(true);
        });
        it('rejects missing slug', () => {
            expect(CreateAccountSchema.safeParse({ name: 'Acme' }).success).toBe(false);
        });
        it('rejects empty name', () => {
            expect(CreateAccountSchema.safeParse({ name: '', slug: 'x' }).success).toBe(false);
        });
    });

    describe('UpdateAccountSchema', () => {
        it('accepts partial update', () => {
            expect(UpdateAccountSchema.safeParse({ name: 'NewName' }).success).toBe(true);
        });
        it('accepts empty object (all partial)', () => {
            expect(UpdateAccountSchema.safeParse({}).success).toBe(true);
        });
    });

    describe('AccountMemberSchema', () => {
        it('accepts valid member', () => {
            const m = { account_id: UUID, user_id: UUID2, role: 'admin', created_at: ISO_TS };
            expect(AccountMemberSchema.safeParse(m).success).toBe(true);
        });
        it('rejects invalid role', () => {
            const m = { account_id: UUID, user_id: UUID2, role: 'superadmin', created_at: ISO_TS };
            expect(AccountMemberSchema.safeParse(m).success).toBe(false);
        });
    });

    describe('JoinAccountSchema', () => {
        it('accepts valid input', () => {
            expect(JoinAccountSchema.safeParse({ account_id: UUID, role: 'member' }).success).toBe(true);
        });
        it('rejects missing account_id', () => {
            expect(JoinAccountSchema.safeParse({ role: 'member' }).success).toBe(false);
        });
    });
});

// ============================================================================
// 3. ORGANIZATION
// ============================================================================

describe('3 · Organization', () => {

    const validTeam = {
        id: UUID,
        account_id: UUID,
        name: 'Engineering',
        description: null,
        deleted_at: null,
        created_at: ISO_TS,
        updated_at: ISO_TS,
    };

    describe('TeamSchema', () => {
        it('accepts valid team', () => {
            expect(TeamSchema.safeParse(validTeam).success).toBe(true);
        });
        it('accepts non-null deleted_at (soft delete)', () => {
            expect(TeamSchema.safeParse({ ...validTeam, deleted_at: ISO_TS }).success).toBe(true);
        });
        it('rejects empty name', () => {
            expect(TeamSchema.safeParse({ ...validTeam, name: '' }).success).toBe(false);
        });
    });

    describe('CreateTeamSchema (derived via omit)', () => {
        it('accepts valid input (account_id + name)', () => {
            expect(CreateTeamSchema.safeParse({ account_id: UUID, name: 'Backend', description: null }).success).toBe(true);
        });
        it('omits id, deleted_at, created_at, updated_at', () => {
            const result = CreateTeamSchema.safeParse({
                id: UUID, account_id: UUID, name: 'X', description: null, deleted_at: null, created_at: ISO_TS, updated_at: ISO_TS,
            });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).not.toHaveProperty('id');
                expect(result.data).not.toHaveProperty('deleted_at');
                expect(result.data).not.toHaveProperty('created_at');
                expect(result.data).not.toHaveProperty('updated_at');
            }
        });
        it('rejects missing name', () => {
            expect(CreateTeamSchema.safeParse({ account_id: UUID, description: null }).success).toBe(false);
        });
    });

    describe('TeamMemberSchema', () => {
        it('accepts valid member', () => {
            const m = { team_id: UUID, profile_id: UUID, role: 'lead', title: 'Tech Lead', joined_at: ISO_TS };
            expect(TeamMemberSchema.safeParse(m).success).toBe(true);
        });
        it('accepts null title', () => {
            const m = { team_id: UUID, profile_id: UUID, role: 'contributor', title: null, joined_at: ISO_TS };
            expect(TeamMemberSchema.safeParse(m).success).toBe(true);
        });
    });

    describe('CreateTeamMemberSchema', () => {
        it('applies default role of contributor', () => {
            const result = CreateTeamMemberSchema.safeParse({ team_id: UUID, profile_id: UUID });
            expect(result.success).toBe(true);
            if (result.success) expect(result.data.role).toBe('contributor');
        });
        it('accepts explicit role', () => {
            const result = CreateTeamMemberSchema.safeParse({ team_id: UUID, profile_id: UUID, role: 'lead' });
            expect(result.success).toBe(true);
            if (result.success) expect(result.data.role).toBe('lead');
        });
    });

    describe('UpdateTeamMemberSchema', () => {
        it('accepts partial (role only)', () => {
            expect(UpdateTeamMemberSchema.safeParse({ role: 'stakeholder' }).success).toBe(true);
        });
        it('accepts partial (title only)', () => {
            expect(UpdateTeamMemberSchema.safeParse({ title: 'Staff Eng' }).success).toBe(true);
        });
        it('accepts empty object', () => {
            expect(UpdateTeamMemberSchema.safeParse({}).success).toBe(true);
        });
    });
});

// ============================================================================
// 4. SPRINTS
// ============================================================================

describe('4 · Sprints', () => {

    const validSprint = {
        id: UUID,
        account_id: UUID,
        team_id: UUID,
        name: 'Sprint 1',
        start_date: '2025-06-01',
        end_date: '2025-06-14',
        goal: 'Ship v1',
        status: 'planned' as const,
        created_at: ISO_TS,
        updated_at: ISO_TS,
    };

    describe('SprintSchema', () => {
        it('accepts valid sprint', () => {
            expect(SprintSchema.safeParse(validSprint).success).toBe(true);
        });
        it('accepts null goal', () => {
            expect(SprintSchema.safeParse({ ...validSprint, goal: null }).success).toBe(true);
        });
        it('rejects invalid status', () => {
            expect(SprintSchema.safeParse({ ...validSprint, status: 'cancelled' }).success).toBe(false);
        });
    });

    describe('CreateSprintSchema', () => {
        const input = {
            account_id: UUID,
            team_id: UUID,
            name: 'Sprint 1',
            start_date: '2025-06-01',
            end_date: '2025-06-14',
            goal: null,
            status: 'planned' as const,
        };

        it('accepts valid input', () => {
            expect(CreateSprintSchema.safeParse(input).success).toBe(true);
        });

        it('rejects end_date before start_date', () => {
            const result = CreateSprintSchema.safeParse({ ...input, start_date: '2025-06-14', end_date: '2025-06-01' });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('End date must be after start date');
                expect(result.error.issues[0].path).toContain('end_date');
            }
        });

        it('accepts same start and end date', () => {
            expect(CreateSprintSchema.safeParse({ ...input, start_date: '2025-06-01', end_date: '2025-06-01' }).success).toBe(true);
        });

        it('omits id, created_at, updated_at', () => {
            const result = CreateSprintSchema.safeParse({ ...input, id: UUID, created_at: ISO_TS, updated_at: ISO_TS });
            expect(result.success).toBe(true);
            // After omit, extra keys are stripped
        });

        it('rejects missing required fields', () => {
            expect(CreateSprintSchema.safeParse({ name: 'Sprint' }).success).toBe(false);
        });
    });

    describe('UpdateSprintSchema', () => {
        it('accepts partial update (name only)', () => {
            expect(UpdateSprintSchema.safeParse({ name: 'Renamed Sprint' }).success).toBe(true);
        });

        it('accepts empty object', () => {
            expect(UpdateSprintSchema.safeParse({}).success).toBe(true);
        });

        it('rejects end_date < start_date when both present', () => {
            const result = UpdateSprintSchema.safeParse({ start_date: '2025-06-14', end_date: '2025-06-01' });
            expect(result.success).toBe(false);
        });

        it('allows end_date alone (no cross-field check)', () => {
            expect(UpdateSprintSchema.safeParse({ end_date: '2025-06-01' }).success).toBe(true);
        });
    });
});

// ============================================================================
// 5. PROJECTS
// ============================================================================

describe('5 · Projects', () => {

    const validProject = {
        id: UUID,
        team_id: UUID,
        name: 'Project Alpha',
        description: 'A great project',
        status: 'active' as const,
        created_at: ISO_TS,
        updated_at: ISO_TS,
    };

    describe('ProjectSchema', () => {
        it('accepts valid project', () => {
            expect(ProjectSchema.safeParse(validProject).success).toBe(true);
        });
        it('accepts null description', () => {
            expect(ProjectSchema.safeParse({ ...validProject, description: null }).success).toBe(true);
        });
        it('rejects invalid status', () => {
            expect(ProjectSchema.safeParse({ ...validProject, status: 'draft' }).success).toBe(false);
        });
    });

    describe('CreateProjectSchema', () => {
        it('accepts valid input', () => {
            expect(CreateProjectSchema.safeParse({ team_id: UUID, name: 'Beta' }).success).toBe(true);
        });
        it('accepts optional description', () => {
            expect(CreateProjectSchema.safeParse({ team_id: UUID, name: 'Beta', description: 'Desc' }).success).toBe(true);
        });
        it('accepts null description', () => {
            expect(CreateProjectSchema.safeParse({ team_id: UUID, name: 'Beta', description: null }).success).toBe(true);
        });
        it('rejects empty name', () => {
            expect(CreateProjectSchema.safeParse({ team_id: UUID, name: '' }).success).toBe(false);
        });
    });

    describe('UpdateProjectSchema', () => {
        it('accepts partial (status only)', () => {
            expect(UpdateProjectSchema.safeParse({ status: 'archived' }).success).toBe(true);
        });
        it('accepts empty object', () => {
            expect(UpdateProjectSchema.safeParse({}).success).toBe(true);
        });
    });
});

// ============================================================================
// 6. WORK ITEMS
// ============================================================================

describe('6 · Work Items', () => {

    const validWorkItem = {
        id: UUID,
        team_id: UUID,
        account_id: UUID,
        sprint_id: null,
        assignee_profile_id: null,
        project_id: null,
        title: 'Implement login',
        description: null,
        story_points: 3,
        status: 'todo' as const,
        type: 'story' as const,
        provider: 'native' as const,
        external_id: null,
        external_url: null,
        completed_at: null,
        created_at: ISO_TS,
        updated_at: ISO_TS,
    };

    describe('WorkItemSchema', () => {
        it('accepts valid work item', () => {
            expect(WorkItemSchema.safeParse(validWorkItem).success).toBe(true);
        });
        it('accepts non-null optional FKs', () => {
            const wi = { ...validWorkItem, sprint_id: UUID, assignee_profile_id: UUID, project_id: UUID };
            expect(WorkItemSchema.safeParse(wi).success).toBe(true);
        });
        it('accepts external integration fields', () => {
            const wi = { ...validWorkItem, provider: 'github', external_id: 'GH-123', external_url: 'https://github.com/issue/1' };
            expect(WorkItemSchema.safeParse(wi).success).toBe(true);
        });
        it('rejects invalid external_url', () => {
            expect(WorkItemSchema.safeParse({ ...validWorkItem, external_url: 'not-url' }).success).toBe(false);
        });
        it('rejects negative story_points', () => {
            expect(WorkItemSchema.safeParse({ ...validWorkItem, story_points: -1 }).success).toBe(false);
        });
    });

    describe('CreateWorkItemSchema', () => {
        it('accepts minimal input (applies defaults)', () => {
            const result = CreateWorkItemSchema.safeParse({ team_id: UUID, title: 'Fix bug' });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.story_points).toBe(0);
                expect(result.data.type).toBe('story');
                expect(result.data.provider).toBe('native');
            }
        });
        it('rejects empty title', () => {
            expect(CreateWorkItemSchema.safeParse({ team_id: UUID, title: '' }).success).toBe(false);
        });
        it('rejects missing team_id', () => {
            expect(CreateWorkItemSchema.safeParse({ title: 'Fix it' }).success).toBe(false);
        });
    });

    describe('UpdateWorkItemSchema', () => {
        it('accepts partial (status only)', () => {
            expect(UpdateWorkItemSchema.safeParse({ status: 'done' }).success).toBe(true);
        });
        it('accepts null for nullable fields', () => {
            expect(UpdateWorkItemSchema.safeParse({ sprint_id: null, description: null }).success).toBe(true);
        });
        it('accepts empty object', () => {
            expect(UpdateWorkItemSchema.safeParse({}).success).toBe(true);
        });
    });
});

// ============================================================================
// 7. SURVEYS
// ============================================================================

describe('7 · Surveys', () => {

    describe('SurveySchema', () => {
        it('accepts valid survey', () => {
            const s = { id: UUID, account_id: UUID, team_id: UUID, title: 'Retro', description: null, trigger_event: null, is_system_template: false, created_at: ISO_TS };
            expect(SurveySchema.safeParse(s).success).toBe(true);
        });
        it('accepts null team_id (system template)', () => {
            const s = { id: UUID, account_id: UUID, team_id: null, title: 'System', description: null, trigger_event: null, is_system_template: true, created_at: ISO_TS };
            expect(SurveySchema.safeParse(s).success).toBe(true);
        });
    });

    describe('SurveyQuestionSchema', () => {
        it('accepts valid question', () => {
            const q = { id: UUID, survey_id: UUID, question_text: 'How do you feel?', metric_category: null, response_type: 'scale', options: null, order_index: 0, is_required: true };
            expect(SurveyQuestionSchema.safeParse(q).success).toBe(true);
        });
        it('rejects empty question_text', () => {
            const q = { id: UUID, survey_id: UUID, question_text: '', metric_category: null, response_type: 'text', options: null, order_index: 0, is_required: true };
            expect(SurveyQuestionSchema.safeParse(q).success).toBe(false);
        });
    });

    describe('CreateSurveySchema', () => {
        const input = {
            account_id: UUID,
            title: 'Sprint Retro',
            questions: [
                { question_text: 'Rate your sprint', question_type: 'scale' as const, order_index: 0 },
            ],
        };

        it('accepts valid input with defaults', () => {
            const result = CreateSurveySchema.safeParse(input);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.is_active).toBe(true);
                expect(result.data.questions[0].is_required).toBe(true);
            }
        });

        it('accepts null team_id', () => {
            expect(CreateSurveySchema.safeParse({ ...input, team_id: null }).success).toBe(true);
        });

        it('rejects missing questions array', () => {
            expect(CreateSurveySchema.safeParse({ account_id: UUID, title: 'X' }).success).toBe(false);
        });

        it('rejects empty title', () => {
            expect(CreateSurveySchema.safeParse({ ...input, title: '' }).success).toBe(false);
        });
    });

    describe('SurveyResponseSchema', () => {
        it('accepts valid response', () => {
            const r = { id: UUID, survey_id: UUID, sprint_id: UUID, responder_profile_id: UUID, is_confidential: false, created_at: ISO_TS };
            expect(SurveyResponseSchema.safeParse(r).success).toBe(true);
        });
    });

    describe('SurveyAnswerSchema', () => {
        it('accepts valid answer', () => {
            const a = { id: UUID, response_id: UUID, question_id: UUID, value_text: 'Good', value_number: null, value_json: null };
            expect(SurveyAnswerSchema.safeParse(a).success).toBe(true);
        });
        it('accepts all-null values', () => {
            const a = { id: UUID, response_id: UUID, question_id: UUID, value_text: null, value_number: null, value_json: null };
            expect(SurveyAnswerSchema.safeParse(a).success).toBe(true);
        });
    });

    describe('SubmitSurveyResponseSchema', () => {
        const input = {
            survey_id: UUID,
            sprint_id: UUID,
            answers: [
                { question_id: UUID, value_number: 4 },
            ],
        };

        it('accepts valid input with defaults', () => {
            const result = SubmitSurveyResponseSchema.safeParse(input);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.is_confidential).toBe(false);
            }
        });

        it('accepts explicit is_confidential', () => {
            const result = SubmitSurveyResponseSchema.safeParse({ ...input, is_confidential: true });
            expect(result.success).toBe(true);
            if (result.success) expect(result.data.is_confidential).toBe(true);
        });
    });
});

// ============================================================================
// 8. KUDOS
// ============================================================================

describe('8 · Kudos', () => {

    const validKudos = {
        id: UUID,
        team_id: UUID,
        sprint_id: UUID,
        account_id: UUID,
        sender_profile_id: UUID,
        receiver_profile_id: UUID2,
        message: 'Great pairing session!',
        category: 'support' as const,
        created_at: ISO_TS,
    };

    describe('KudosSchema', () => {
        it('accepts valid kudos', () => {
            expect(KudosSchema.safeParse(validKudos).success).toBe(true);
        });
        it('accepts null sprint_id and category', () => {
            expect(KudosSchema.safeParse({ ...validKudos, sprint_id: null, category: null }).success).toBe(true);
        });
        it('rejects empty message', () => {
            expect(KudosSchema.safeParse({ ...validKudos, message: '' }).success).toBe(false);
        });
    });

    describe('GiveKudosSchema (derived via omit)', () => {
        it('accepts valid input', () => {
            const input = {
                team_id: UUID,
                sprint_id: UUID,
                receiver_profile_id: UUID2,
                message: 'Thanks!',
                category: 'unblock' as const,
            };
            expect(GiveKudosSchema.safeParse(input).success).toBe(true);
        });

        it('omits id, account_id, sender_profile_id, created_at', () => {
            const input = {
                id: UUID,
                account_id: UUID,
                sender_profile_id: UUID,
                created_at: ISO_TS,
                team_id: UUID,
                sprint_id: UUID,
                receiver_profile_id: UUID2,
                message: 'Thanks!',
                category: null,
            };
            const result = GiveKudosSchema.safeParse(input);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).not.toHaveProperty('id');
                expect(result.data).not.toHaveProperty('account_id');
                expect(result.data).not.toHaveProperty('sender_profile_id');
                expect(result.data).not.toHaveProperty('created_at');
            }
        });
    });
});

// ============================================================================
// 9. SPRINT ANALYTICS & METRICS
// ============================================================================

describe('9 · Sprint Analytics & Metrics', () => {

    describe('SprintCommitmentSchema', () => {
        it('accepts valid commitment', () => {
            const c = { id: UUID, sprint_id: UUID, profile_id: UUID, committed_points: 21, committed_items: 5, created_at: ISO_TS };
            expect(SprintCommitmentSchema.safeParse(c).success).toBe(true);
        });
        it('accepts null profile_id (team-level)', () => {
            const c = { id: UUID, sprint_id: UUID, profile_id: null, committed_points: 0, committed_items: 0, created_at: ISO_TS };
            expect(SprintCommitmentSchema.safeParse(c).success).toBe(true);
        });
    });

    describe('CreateSprintCommitmentSchema', () => {
        it('applies defaults for points and items', () => {
            const result = CreateSprintCommitmentSchema.safeParse({ sprint_id: UUID });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.committed_points).toBe(0);
                expect(result.data.committed_items).toBe(0);
            }
        });
    });

    describe('SprintSnapshotSchema', () => {
        it('accepts valid snapshot', () => {
            const s = {
                id: UUID, sprint_id: UUID, profile_id: null,
                snapshot_date: '2025-06-07',
                points_completed: 8, points_remaining: 13,
                items_completed: 3, items_remaining: 4,
                created_at: ISO_TS,
            };
            expect(SprintSnapshotSchema.safeParse(s).success).toBe(true);
        });
    });

    describe('CreateSprintSnapshotSchema', () => {
        it('applies defaults for all metric fields', () => {
            const result = CreateSprintSnapshotSchema.safeParse({ sprint_id: UUID });
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.points_completed).toBe(0);
                expect(result.data.points_remaining).toBe(0);
                expect(result.data.items_completed).toBe(0);
                expect(result.data.items_remaining).toBe(0);
            }
        });
        it('accepts optional snapshot_date', () => {
            expect(CreateSprintSnapshotSchema.safeParse({ sprint_id: UUID, snapshot_date: '2025-06-07' }).success).toBe(true);
        });
    });

    describe('HistoricalMetricSchema', () => {
        const validMetric = {
            id: UUID,
            team_id: UUID,
            profile_id: null,
            metric_date: '2025-06-01',
            import_batch_id: null,
            velocity_avg: 21.5,
            last_sprint_points_completed: 21,
            last_sprint_items_completed: 7,
            last_sprint_points_incomplete: 3,
            last_sprint_items_incomplete: 1,
            satisfaction_score: 4,
            flow_score: 3,
            friction_score: 2,
            safety_score: 5,
            workload_balance_score: 4,
            requirement_clarity_score: 3,
            support_score: 4,
            custom_soft_metrics: null,
            created_at: ISO_TS,
        };

        it('accepts valid metric', () => {
            expect(HistoricalMetricSchema.safeParse(validMetric).success).toBe(true);
        });

        it('accepts all-null metric fields', () => {
            const allNull = {
                ...validMetric,
                velocity_avg: null,
                last_sprint_points_completed: null,
                last_sprint_items_completed: null,
                last_sprint_points_incomplete: null,
                last_sprint_items_incomplete: null,
                satisfaction_score: null,
                flow_score: null,
                friction_score: null,
                safety_score: null,
                workload_balance_score: null,
                requirement_clarity_score: null,
                support_score: null,
            };
            expect(HistoricalMetricSchema.safeParse(allNull).success).toBe(true);
        });

        it('rejects score outside 1-5 range', () => {
            expect(HistoricalMetricSchema.safeParse({ ...validMetric, satisfaction_score: 0 }).success).toBe(false);
            expect(HistoricalMetricSchema.safeParse({ ...validMetric, satisfaction_score: 6 }).success).toBe(false);
        });

        it('accepts custom_soft_metrics as record', () => {
            expect(HistoricalMetricSchema.safeParse({ ...validMetric, custom_soft_metrics: { morale: 4 } }).success).toBe(true);
        });
    });

    describe('CreateHistoricalMetricSchema (derived via omit)', () => {
        it('accepts input without id and created_at', () => {
            const input = {
                team_id: UUID,
                profile_id: null,
                metric_date: '2025-06-01',
                import_batch_id: null,
                velocity_avg: null,
                last_sprint_points_completed: null,
                last_sprint_items_completed: null,
                last_sprint_points_incomplete: null,
                last_sprint_items_incomplete: null,
                satisfaction_score: null,
                flow_score: null,
                friction_score: null,
                safety_score: null,
                workload_balance_score: null,
                requirement_clarity_score: null,
                support_score: null,
                custom_soft_metrics: null,
            };
            const result = CreateHistoricalMetricSchema.safeParse(input);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data).not.toHaveProperty('id');
                expect(result.data).not.toHaveProperty('created_at');
            }
        });
    });
});
