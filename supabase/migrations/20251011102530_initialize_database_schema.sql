-- migration: 20251011120000_initialize_database_schema.sql
-- description: a full database schema initialization based on db-plan.md.
-- tables affected: profiles, categories, tags, notes, note_tags, srs_data, quizzes, questions, answers, quiz_attempts
-- enums affected: quiz_status, question_type
-- functions affected: handle_updated_at
-- special notes: this is the initial schema setup. it includes table creations, rls policies, triggers, and indexes.

-- section: helper functions and triggers
-- description: functions and triggers for common database operations like updating timestamps.

-- creates a trigger function to automatically update the `updated_at` column of a table.
-- this function is designed to be used by triggers on various tables.
create function public.handle_updated_at()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

-- creates a profile for a new user.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

-- section: enum types
-- description: custom data types used across the database schema.

-- defines the possible statuses for a quiz.
create type public.quiz_status as enum ('pending_acceptance', 'accepted', 'rejected');

-- defines the types of questions that can be in a quiz.
create type public.question_type as enum ('true_false', 'multiple_choice', 'short_answer');


-- section: table schemas
-- description: definition of all tables in the public schema.

-- table: public.profiles
-- description: stores user-specific application data, extending the `auth.users` table.
create table public.profiles (
    id uuid not null primary key references auth.users(id) on delete cascade,
    encrypted_api_key text null,
    free_quizzes_remaining smallint not null default 5 check (free_quizzes_remaining >= 0),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
-- comments for profiles table
comment on table public.profiles is 'user profiles extending auth.users.';
comment on column public.profiles.id is 'user''s unique identifier from `auth.users`.';
comment on column public.profiles.encrypted_api_key is 'user''s encrypted ai api key.';
comment on column public.profiles.free_quizzes_remaining is 'counter for free quiz generations.';

-- table: public.categories
-- description: stores user-defined categories for organizing notes.
create table public.categories (
    id uuid not null primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    name text not null,
    created_at timestamptz not null default now(),
    unique(user_id, name)
);
-- comments for categories table
comment on table public.categories is 'user-defined categories for notes.';
comment on column public.categories.user_id is 'owner of the category.';

-- table: public.tags
-- description: stores user-defined tags for organizing notes.
create table public.tags (
    id uuid not null primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    name text not null,
    created_at timestamptz not null default now(),
    unique(user_id, name)
);
-- comments for tags table
comment on table public.tags is 'user-defined tags for notes.';
comment on column public.tags.user_id is 'owner of the tag.';

-- table: public.notes
-- description: the main entity for storing user notes.
create table public.notes (
    id uuid not null primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    category_id uuid null references public.categories(id) on delete set null,
    title text not null,
    content text not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
-- comments for notes table
comment on table public.notes is 'main table for storing user notes in markdown format.';
comment on column public.notes.user_id is 'owner of the note.';
comment on column public.notes.category_id is 'category the note belongs to (optional).';

-- table: public.note_tags
-- description: a join table for the many-to-many relationship between `notes` and `tags`.
create table public.note_tags (
    note_id uuid not null references public.notes(id) on delete cascade,
    tag_id uuid not null references public.tags(id) on delete cascade,
    primary key(note_id, tag_id)
);
-- comments for note_tags table
comment on table public.note_tags is 'join table for many-to-many relationship between notes and tags.';

-- table: public.srs_data
-- description: stores the spaced repetition system data for each note.
create table public.srs_data (
    note_id uuid not null primary key references public.notes(id) on delete cascade,
    due_date timestamptz not null default now(),
    interval real not null default 0,
    ease_factor real not null default 2.5,
    updated_at timestamptz not null default now()
);
-- comments for srs_data table
comment on table public.srs_data is 'stores spaced repetition system (srs) data for each note.';
comment on column public.srs_data.due_date is 'the next scheduled review date.';
comment on column public.srs_data.interval is 'the interval in days for the next review.';
comment on column public.srs_data.ease_factor is 'a factor representing memory stability.';


-- table: public.quizzes
-- description: stores quizzes generated from notes.
create table public.quizzes (
    id uuid not null primary key default gen_random_uuid(),
    note_id uuid not null references public.notes(id) on delete cascade,
    status public.quiz_status not null default 'pending_acceptance',
    ai_prompt text null,
    ai_raw_response jsonb null,
    ai_model_version text null,
    created_at timestamptz not null default now()
);
-- comments for quizzes table
comment on table public.quizzes is 'stores quizzes generated from user notes.';
comment on column public.quizzes.note_id is 'the note this quiz was generated from.';
comment on column public.quizzes.status is 'the current status of the quiz (e.g., pending, accepted).';
comment on column public.quizzes.ai_raw_response is 'the raw, unprocessed json response from the ai.';


-- table: public.questions
-- description: stores individual questions for a quiz.
create table public.questions (
    id uuid not null primary key default gen_random_uuid(),
    quiz_id uuid not null references public.quizzes(id) on delete cascade,
    type public.question_type not null,
    content text not null,
    question_order smallint not null,
    correct_answers_data jsonb not null,
    created_at timestamptz not null default now()
);
-- comments for questions table
comment on table public.questions is 'stores individual questions for a quiz.';
comment on column public.questions.quiz_id is 'the quiz this question belongs to.';
comment on column public.questions.question_order is 'the display order of the question within the quiz.';
comment on column public.questions.correct_answers_data is 'structured data for correct answers (e.g., list of valid strings).';

-- table: public.answers
-- description: stores the possible answer options for multiple-choice questions.
create table public.answers (
    id uuid not null primary key default gen_random_uuid(),
    question_id uuid not null references public.questions(id) on delete cascade,
    content text not null,
    is_correct boolean not null default false,
    created_at timestamptz not null default now()
);
-- comments for answers table
comment on table public.answers is 'stores possible answer options for multiple-choice questions.';
comment on column public.answers.question_id is 'the question this answer belongs to.';
comment on column public.answers.is_correct is 'indicates if this is a correct answer.';

-- table: public.quiz_attempts
-- description: records a user's attempt to solve a quiz.
create table public.quiz_attempts (
    id uuid not null primary key default gen_random_uuid(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    quiz_id uuid not null references public.quizzes(id) on delete cascade,
    score_percentage smallint not null check (score_percentage between 0 and 100),
    completed_at timestamptz not null default now(),
    user_answers jsonb not null
);
-- comments for quiz_attempts table
comment on table public.quiz_attempts is 'records a user''s attempt to solve a quiz.';
comment on column public.quiz_attempts.score_percentage is 'the final score as a percentage.';
comment on column public.quiz_attempts.user_answers is 'a json object storing the user''s answers for each question.';

-- section: triggers
-- description: setting up triggers for automated actions on tables.

-- trigger to create a profile for a new user.
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- trigger for profiles table to update `updated_at` column on any row modification.
create trigger on_profiles_updated
before update on public.profiles
for each row execute procedure public.handle_updated_at();

-- trigger for notes table to update `updated_at` column on any row modification.
create trigger on_notes_updated
before update on public.notes
for each row execute procedure public.handle_updated_at();


-- section: row level security (rls)
-- description: enabling rls and defining policies for all tables.

-- rls for public.profiles
-- alter table public.profiles enable row level security;
-- create policy "allow authenticated users to select own profile" on public.profiles for select to authenticated using (auth.uid() = id);
-- create policy "allow authenticated users to insert own profile" on public.profiles for insert to authenticated with check (auth.uid() = id);
-- create policy "allow authenticated users to update own profile" on public.profiles for update to authenticated using (auth.uid() = id);
-- create policy "allow authenticated users to delete own profile" on public.profiles for delete to authenticated using (auth.uid() = id);
-- create policy "disallow anon users to select profiles" on public.profiles for select to anon using (false);
-- create policy "disallow anon users to insert profiles" on public.profiles for insert to anon with check (false);
-- create policy "disallow anon users to update profiles" on public.profiles for update to anon using (false);
-- create policy "disallow anon users to delete profiles" on public.profiles for delete to anon using (false);

-- -- rls for public.categories
-- alter table public.categories enable row level security;
-- create policy "allow authenticated users to select own categories" on public.categories for select to authenticated using (auth.uid() = user_id);
-- create policy "allow authenticated users to insert own categories" on public.categories for insert to authenticated with check (auth.uid() = user_id);
-- create policy "allow authenticated users to update own categories" on public.categories for update to authenticated using (auth.uid() = user_id);
-- create policy "allow authenticated users to delete own categories" on public.categories for delete to authenticated using (auth.uid() = user_id);
-- create policy "disallow anon users to select categories" on public.categories for select to anon using (false);
-- create policy "disallow anon users to insert categories" on public.categories for insert to anon with check (false);
-- create policy "disallow anon users to update categories" on public.categories for update to anon using (false);
-- create policy "disallow anon users to delete categories" on public.categories for delete to anon using (false);

-- -- rls for public.tags
-- alter table public.tags enable row level security;
-- create policy "allow authenticated users to select own tags" on public.tags for select to authenticated using (auth.uid() = user_id);
-- create policy "allow authenticated users to insert own tags" on public.tags for insert to authenticated with check (auth.uid() = user_id);
-- create policy "allow authenticated users to update own tags" on public.tags for update to authenticated using (auth.uid() = user_id);
-- create policy "allow authenticated users to delete own tags" on public.tags for delete to authenticated using (auth.uid() = user_id);
-- create policy "disallow anon users to select tags" on public.tags for select to anon using (false);
-- create policy "disallow anon users to insert tags" on public.tags for insert to anon with check (false);
-- create policy "disallow anon users to update tags" on public.tags for update to anon using (false);
-- create policy "disallow anon users to delete tags" on public.tags for delete to anon using (false);

-- -- rls for public.notes
-- alter table public.notes enable row level security;
-- create policy "allow authenticated users to select own notes" on public.notes for select to authenticated using (auth.uid() = user_id);
-- create policy "allow authenticated users to insert own notes" on public.notes for insert to authenticated with check (auth.uid() = user_id);
-- create policy "allow authenticated users to update own notes" on public.notes for update to authenticated using (auth.uid() = user_id);
-- create policy "allow authenticated users to delete own notes" on public.notes for delete to authenticated using (auth.uid() = user_id);
-- create policy "disallow anon users to select notes" on public.notes for select to anon using (false);
-- create policy "disallow anon users to insert notes" on public.notes for insert to anon with check (false);
-- create policy "disallow anon users to update notes" on public.notes for update to anon using (false);
-- create policy "disallow anon users to delete notes" on public.notes for delete to anon using (false);

-- -- rls for public.note_tags
-- alter table public.note_tags enable row level security;
-- create policy "allow authenticated users to select own note_tags" on public.note_tags for select to authenticated using (exists (select 1 from notes where notes.id = note_tags.note_id and notes.user_id = auth.uid()));
-- create policy "allow authenticated users to insert own note_tags" on public.note_tags for insert to authenticated with check (exists (select 1 from notes where notes.id = note_tags.note_id and notes.user_id = auth.uid()));
-- create policy "allow authenticated users to delete own note_tags" on public.note_tags for delete to authenticated using (exists (select 1 from notes where notes.id = note_tags.note_id and notes.user_id = auth.uid()));
-- -- note: update is not applicable for join table, composite key would be changed.
-- create policy "disallow anon users to select note_tags" on public.note_tags for select to anon using (false);
-- create policy "disallow anon users to insert note_tags" on public.note_tags for insert to anon with check (false);
-- create policy "disallow anon users to delete note_tags" on public.note_tags for delete to anon using (false);

-- -- rls for public.srs_data
-- alter table public.srs_data enable row level security;
-- create policy "allow authenticated users to select own srs_data" on public.srs_data for select to authenticated using (exists (select 1 from notes where notes.id = srs_data.note_id and notes.user_id = auth.uid()));
-- create policy "allow authenticated users to insert own srs_data" on public.srs_data for insert to authenticated with check (exists (select 1 from notes where notes.id = srs_data.note_id and notes.user_id = auth.uid()));
-- create policy "allow authenticated users to update own srs_data" on public.srs_data for update to authenticated using (exists (select 1 from notes where notes.id = srs_data.note_id and notes.user_id = auth.uid()));
-- create policy "allow authenticated users to delete own srs_data" on public.srs_data for delete to authenticated using (exists (select 1 from notes where notes.id = srs_data.note_id and notes.user_id = auth.uid()));
-- create policy "disallow anon users to select srs_data" on public.srs_data for select to anon using (false);
-- create policy "disallow anon users to insert srs_data" on public.srs_data for insert to anon with check (false);
-- create policy "disallow anon users to update srs_data" on public.srs_data for update to anon using (false);
-- create policy "disallow anon users to delete srs_data" on public.srs_data for delete to anon using (false);

-- -- rls for public.quizzes
-- alter table public.quizzes enable row level security;
-- create policy "allow authenticated users to select own quizzes" on public.quizzes for select to authenticated using (exists (select 1 from notes where notes.id = quizzes.note_id and notes.user_id = auth.uid()));
-- create policy "allow authenticated users to insert own quizzes" on public.quizzes for insert to authenticated with check (exists (select 1 from notes where notes.id = quizzes.note_id and notes.user_id = auth.uid()));
-- create policy "allow authenticated users to update own quizzes" on public.quizzes for update to authenticated using (exists (select 1 from notes where notes.id = quizzes.note_id and notes.user_id = auth.uid()));
-- create policy "allow authenticated users to delete own quizzes" on public.quizzes for delete to authenticated using (exists (select 1 from notes where notes.id = quizzes.note_id and notes.user_id = auth.uid()));
-- create policy "disallow anon users to select quizzes" on public.quizzes for select to anon using (false);
-- create policy "disallow anon users to insert quizzes" on public.quizzes for insert to anon with check (false);
-- create policy "disallow anon users to update quizzes" on public.quizzes for update to anon using (false);
-- create policy "disallow anon users to delete quizzes" on public.quizzes for delete to anon using (false);

-- -- rls for public.questions
-- alter table public.questions enable row level security;
-- create policy "allow authenticated users to select own questions" on public.questions for select to authenticated using (exists (select 1 from quizzes join notes on quizzes.note_id = notes.id where quizzes.id = questions.quiz_id and notes.user_id = auth.uid()));
-- create policy "allow authenticated users to insert own questions" on public.questions for insert to authenticated with check (exists (select 1 from quizzes join notes on quizzes.note_id = notes.id where quizzes.id = questions.quiz_id and notes.user_id = auth.uid()));
-- create policy "allow authenticated users to update own questions" on public.questions for update to authenticated using (exists (select 1 from quizzes join notes on quizzes.note_id = notes.id where quizzes.id = questions.quiz_id and notes.user_id = auth.uid()));
-- create policy "allow authenticated users to delete own questions" on public.questions for delete to authenticated using (exists (select 1 from quizzes join notes on quizzes.note_id = notes.id where quizzes.id = questions.quiz_id and notes.user_id = auth.uid()));
-- create policy "disallow anon users to select questions" on public.questions for select to anon using (false);
-- create policy "disallow anon users to insert questions" on public.questions for insert to anon with check (false);
-- create policy "disallow anon users to update questions" on public.questions for update to anon using (false);
-- create policy "disallow anon users to delete questions" on public.questions for delete to anon using (false);

-- -- rls for public.answers
-- alter table public.answers enable row level security;
-- create policy "allow authenticated users to select own answers" on public.answers for select to authenticated using (exists (select 1 from questions join quizzes on questions.quiz_id = quizzes.id join notes on quizzes.note_id = notes.id where questions.id = answers.question_id and notes.user_id = auth.uid()));
-- create policy "allow authenticated users to insert own answers" on public.answers for insert to authenticated with check (exists (select 1 from questions join quizzes on questions.quiz_id = quizzes.id join notes on quizzes.note_id = notes.id where questions.id = answers.question_id and notes.user_id = auth.uid()));
-- create policy "allow authenticated users to update own answers" on public.answers for update to authenticated using (exists (select 1 from questions join quizzes on questions.quiz_id = quizzes.id join notes on quizzes.note_id = notes.id where questions.id = answers.question_id and notes.user_id = auth.uid()));
-- create policy "allow authenticated users to delete own answers" on public.answers for delete to authenticated using (exists (select 1 from questions join quizzes on questions.quiz_id = quizzes.id join notes on quizzes.note_id = notes.id where questions.id = answers.question_id and notes.user_id = auth.uid()));
-- create policy "disallow anon users to select answers" on public.answers for select to anon using (false);
-- create policy "disallow anon users to insert answers" on public.answers for insert to anon with check (false);
-- create policy "disallow anon users to update answers" on public.answers for update to anon using (false);
-- create policy "disallow anon users to delete answers" on public.answers for delete to anon using (false);

-- -- rls for public.quiz_attempts
-- alter table public.quiz_attempts enable row level security;
-- create policy "allow authenticated users to select own quiz_attempts" on public.quiz_attempts for select to authenticated using (auth.uid() = user_id);
-- create policy "allow authenticated users to insert own quiz_attempts" on public.quiz_attempts for insert to authenticated with check (auth.uid() = user_id);
-- -- users should not be able to update or delete their past attempts to maintain integrity.
-- create policy "disallow authenticated users to update quiz_attempts" on public.quiz_attempts for update to authenticated using (false);
-- create policy "disallow authenticated users to delete quiz_attempts" on public.quiz_attempts for delete to authenticated using (false);
-- create policy "disallow anon users to select quiz_attempts" on public.quiz_attempts for select to anon using (false);
-- create policy "disallow anon users to insert quiz_attempts" on public.quiz_attempts for insert to anon with check (false);
-- create policy "disallow anon users to update quiz_attempts" on public.quiz_attempts for update to anon using (false);
-- create policy "disallow anon users to delete quiz_attempts" on public.quiz_attempts for delete to anon using (false);


-- section: indexes
-- description: creating indexes on frequently queried columns to improve performance.

create index categories_user_id_name_idx on public.categories (user_id, name);
create index tags_user_id_name_idx on public.tags (user_id, name);
create index notes_updated_at_idx on public.notes (updated_at desc);
create index questions_quiz_id_order_idx on public.questions (quiz_id, question_order);
