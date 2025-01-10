export interface Quiz {
  quiz_id: string;
  quiz_name: string;
  note_id: string;
  question_type: string;
  num_questions: number;
  blooms_taxonomy_level: string;
  difficulty: string;
  created_at: Date;
  description?: string;
  updated_at: Date;
}
