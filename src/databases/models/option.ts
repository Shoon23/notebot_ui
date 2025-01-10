export interface Option {
  option_id: string;
  question_id: string;
  content: string;
  is_answer: boolean;
  explanation?: string;
}
