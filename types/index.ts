// Mirrors the questions_471 table in Supabase exactly
export interface Question {
  id: string;
  year: number;
  question_number: number;
  topic: string;
  exam_code: string;
  moed: string;          // 'א' | 'ב' | 'חורף'
  question_url: string | null;
  solution_url: string | null;
}

export interface NewQuestion {
  year: number;
  question_number: number;
  topic: string;
  exam_code: string;
  moed: string;
  question_url: string | null;
  solution_url: string | null;
}

export interface DailyQuestions {
  date: string;
  questions: [Question, Question];
}
