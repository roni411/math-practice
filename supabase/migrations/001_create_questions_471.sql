-- Create questions table for exam code 471 (4-unit math matriculation)
create table if not exists questions_471 (
  id            uuid primary key default gen_random_uuid(),
  year          integer      not null,
  question_number integer    not null,
  topic         text         not null,
  exam_code     text         not null default '471',
  question_url  text,
  solution_url  text
);

-- Index for filtering by topic (used by getRandomQuestionByTopic)
create index if not exists idx_questions_471_topic on questions_471 (topic);

-- ---------------------------------------------------------------
-- Seed data
-- ---------------------------------------------------------------
insert into questions_471 (year, question_number, topic, exam_code)
values
  (2022, 3, 'derivatives',    '471'),
  (2021, 5, 'probability',    '471'),
  (2019, 4, 'geometry',       '471'),
  (2020, 2, 'trigonometry',   '471'),
  (2023, 1, 'algebra',        '471'),
  (2023, 6, 'integrals',      '471'),
  (2018, 3, 'sequences',      '471'),
  (2017, 2, 'logarithms',     '471');
