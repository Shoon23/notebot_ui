export interface OptionAnswer {
  option_answer_id: string;
  quiz_attempt_id: string;
  question_id: string;
  option_id?: string;
  is_correct: boolean;
}
