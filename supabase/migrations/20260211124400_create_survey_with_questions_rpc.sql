create or replace function public.create_survey_with_questions(
  p_account_id uuid,
  p_team_id    uuid default null,
  p_title      text default '',
  p_is_active  boolean default true,
  p_questions  jsonb default '[]'::jsonb
)
returns jsonb
language plpgsql
security definer -- Elevation required for transaction, but requires manual auth check
set search_path = ''
as $$
declare
  v_survey_id uuid;
  v_questions jsonb;
begin
  -- 1. SECURITY CHECK: Ensure user belongs to the account
  if not exists (
    select 1 
    from public.account_members 
    where account_id = p_account_id 
    and user_id = auth.uid()
  ) then
    raise exception 'Access Denied: User is not a member of this account';
  end if;

  -- 2. Insert the survey
  insert into public.surveys (account_id, team_id, title, is_active)
  values (p_account_id, p_team_id, p_title, p_is_active)
  returning id into v_survey_id;

  -- 3. Bulk Insert Questions (Set-based is faster than Loop)
  -- Maps 'question_type' from JSON to 'response_type' column
  insert into public.survey_questions (
    survey_id, question_text, response_type, order_index, is_required
  )
  select 
    v_survey_id,
    x.question_text,
    x.question_type, -- Maps Zod 'question_type' -> DB 'response_type'
    x.order_index,
    coalesce(x.is_required, true)
  from jsonb_to_recordset(p_questions) as x(
    question_text text,
    question_type text,
    order_index int,
    is_required boolean
  );

  -- 4. Return the result
  select jsonb_build_object(
    'id', v_survey_id,
    'account_id', p_account_id,
    'title', p_title,
    'questions', (
       select coalesce(jsonb_agg(sq order by sq.order_index), '[]'::jsonb)
       from public.survey_questions sq
       where sq.survey_id = v_survey_id
    )
  ) into v_questions;

  return v_questions;
end;
$$;