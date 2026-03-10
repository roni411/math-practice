export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
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
        Relationships: [];
      };
      solved_questions: {
        Row: {
          id: string;
          question_id: string;
          solved_at: string;
        };
        Insert: {
          id?: string;
          question_id: string;
          solved_at?: string;
        };
        Update: {
          id?: string;
          question_id?: string;
          solved_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
