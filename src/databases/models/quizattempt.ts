export interface QuizAttempt {
  quiz_attempt_id: string;
  num_questions: number;
  quiz_id: string;
  score: number;
  created_at: Date;
  updated_at: Date;
  finished_at?: Date;
}
