export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      solved_questions: {
        Row:    { id: string; question_id: string; solved_at: string };
        Insert: { id?: string; question_id: string; solved_at?: string };
        Update: { id?: string; question_id?: string; solved_at?: string };
      };
      questions_471: {
        Row: {
          id: string;
          year: number;
          question_number: number;
          topic: string;
          exam_code: string;
          moed: string;
          question_url: string | null;
          solution_url: string | null;
        };
        Insert: {
          id?: string;
          year: number;
          question_number: number;
          topic: string;
          exam_code: string;
          moed?: string;
          question_url?: string | null;
          solution_url?: string | null;
        };
        Update: {
          id?: string;
          year?: number;
          question_number?: number;
          topic?: string;
          exam_code?: string;
          moed?: string;
          question_url?: string | null;
          solution_url?: string | null;
        };
      };
    };
  };
}
