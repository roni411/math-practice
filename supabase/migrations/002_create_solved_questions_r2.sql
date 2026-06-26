-- Round 2 progress table (round 1 preserved in solved_questions)
create table if not exists solved_questions_r2 (
  id          uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions_471 (id) on delete cascade,
  solved_at   timestamptz not null default now()
);

create index if not exists idx_solved_r2_question_id on solved_questions_r2 (question_id);
