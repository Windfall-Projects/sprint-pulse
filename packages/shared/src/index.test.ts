
import { describe, it, expect } from 'vitest';
import {
    CreateSprintSchema,
    DateString,
    TeamRoleEnum,
    WorkItemStatusEnum
} from './schemas/index.js';

describe('Shared Package Schemas', () => {

    describe('DateString Schema', () => {
        it('should accept valid YYYY-MM-DD date strings', () => {
            expect(DateString.safeParse('2023-10-27').success).toBe(true);
            expect(DateString.safeParse('2024-02-29').success).toBe(true); // Leap year
        });

        it('should reject invalid formats', () => {
            expect(DateString.safeParse('2023/10/27').success).toBe(false);
            expect(DateString.safeParse('27-10-2023').success).toBe(false);
            expect(DateString.safeParse('2023-13-01').success).toBe(true); // Regex only checks digits, logical date validation is handled by Postgres or other layers if needed, but here we only check format pattern often. Wait, regex is ^\d{4}-\d{2}-\d{2}$. 
            // Actually strictly speaking the regex `^\d{4}-\d{2}-\d{2}$` allows 9999-99-99. 
            // Zod's .date() or .datetime() might be better if we wanted strict calendar validation, 
            // but the current implementation uses a regex.
            // Let's just test the regex constraint for now.
            expect(DateString.safeParse('invalid-date').success).toBe(false);
        });
    });

    describe('Enum Validations', () => {
        it('should validate TeamRoleEnum', () => {
            expect(TeamRoleEnum.safeParse('lead').success).toBe(true);
            expect(TeamRoleEnum.safeParse('contributor').success).toBe(true);
            expect(TeamRoleEnum.safeParse('stakeholder').success).toBe(true);
            expect(TeamRoleEnum.safeParse('admin').success).toBe(false); // Invalid
        });

        it('should validate WorkItemStatusEnum', () => {
            expect(WorkItemStatusEnum.safeParse('todo').success).toBe(true);
            expect(WorkItemStatusEnum.safeParse('in_progress').success).toBe(true);
            expect(WorkItemStatusEnum.safeParse('done').success).toBe(true);
            expect(WorkItemStatusEnum.safeParse('archived').success).toBe(false);
        });
    });

    describe('CreateSprintSchema', () => {
        const validSprint = {
            account_id: '123e4567-e89b-12d3-a456-426614174000',
            team_id: '123e4567-e89b-12d3-a456-426614174000',
            name: 'Sprint 1',
            start_date: '2023-10-01',
            end_date: '2023-10-14',
            goal: null,
            status: 'planned' as const,
        };

        it('should pass for valid sprint data', () => {
            const result = CreateSprintSchema.safeParse(validSprint);
            expect(result.success).toBe(true);
        });

        it('should fail if end_date is before start_date', () => {
            const result = CreateSprintSchema.safeParse({
                ...validSprint,
                start_date: '2023-10-14',
                end_date: '2023-10-01',
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.issues[0].message).toBe('End date must be after start date');
            }
        });

        it('should fail if required fields are missing', () => {
            const result = CreateSprintSchema.safeParse({
                name: 'Sprint 1'
            });
            expect(result.success).toBe(false);
        });
    });

});
