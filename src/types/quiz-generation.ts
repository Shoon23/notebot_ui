export interface iFormQuizGeneration {
  quiz_name: string;

  num_questions?: number;
  difficulty: string;
  question_type: string;
  blooms_taxonomy_level: string;
}
