-- Seed Data for Sprint Pulse

-- 0. Create a Dummy Auth User (Required for Account Ownership)
-- Note: We use a fixed UUID for the owner.
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud)
VALUES 
    ('00000000-0000-0000-0000-000000000000', 'owner@example.com', 'password', NOW(), '{"provider":"email","providers":["email"]}', '{}', NOW(), NOW(), 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- 1. Create an Account
INSERT INTO public.accounts (id, name, slug, is_test_tenant, owner_user_id)
VALUES 
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Carp Corp', 'carp-corp', true, '00000000-0000-0000-0000-000000000000');

-- 2. Create a Team
INSERT INTO public.teams (id, account_id, name, description)
VALUES 
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Engineering Team', 'Core engineering team');

-- 3. Create Virtual Profiles (Contributors)
INSERT INTO public.profiles (id, auth_user_id, display_name, avatar_url)
VALUES 
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01', NULL, 'Alice West (Virtual)', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice'),
    ('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c02', NULL, 'James Brooks (Virtual)', 'https://api.dicebear.com/7.x/avataaars/svg?seed=James'),
    ('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c03', NULL, 'Danielle Fuentes (Virtual)', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Danielle');

-- 4. Add Profiles to Team
INSERT INTO public.team_members (team_id, profile_id, role, title)
VALUES 
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01', 'lead', 'Tech Lead'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c02', 'contributor', 'Senior Engineer'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380c03', 'contributor', 'QA Engineer');

-- 5. Create a Sprint
INSERT INTO public.sprints (id, team_id, account_id, name, start_date, end_date, status, goal)
VALUES 
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380d01', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Sprint 1', CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days', 'active', 'Launch MVP');

-- 6. Create Work Items
INSERT INTO public.work_items (id, team_id, account_id, sprint_id, assignee_profile_id, title, description, status, type, story_points, provider)
VALUES 
    -- Alice's Items
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380e01', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d01', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01', 'Setup Project Structure', 'Initialize repo and tools', 'done', 'task', 3, 'native'),
    ('e1eebc99-9c0b-4ef8-bb6d-6bb9bd380e02', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d01', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380c01', 'Database Schema Design', 'Draft initial schema', 'in_progress', 'story', 5, 'native'),
    
    -- Bob's Items
    ('e2eebc99-9c0b-4ef8-bb6d-6bb9bd380e01', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d01', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380c02', 'Implement API Auth', 'Setup Supabase Auth', 'todo', 'story', 8, 'native'),
    
    -- Unassigned Items
    ('e3eebc99-9c0b-4ef8-bb6d-6bb9bd380e01', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380d01', NULL, 'Write Documentation', 'Update README', 'todo', 'chore', 1, 'native');

-- 7. Create a Survey
INSERT INTO public.surveys (id, account_id, team_id, title, is_system_template, created_at)
VALUES 
    ('f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f01', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380b11', 'Sprint 1 Retro', false, NOW());

-- 8. Create Survey Questions
INSERT INTO public.survey_questions (id, survey_id, question_text, response_type, order_index, is_required)
VALUES 
    ('f1eebc99-9c0b-4ef8-bb6d-6bb9bd380f01', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f01', 'How satisfied are you with the sprint?', 'scale_1_5', 0, true),
    ('f2eebc99-9c0b-4ef8-bb6d-6bb9bd380f02', 'f0eebc99-9c0b-4ef8-bb6d-6bb9bd380f01', 'What went well?', 'text', 1, false);
