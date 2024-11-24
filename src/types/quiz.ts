export interface iQuiz {
  blooms_taxonomy_level: string;
  difficulty: string;
  question_type: string;
  quiz_id: string;
  quiz_name: string;
}

export interface iQuizDetails extends iQuiz {
  question: iQuestion[];
}

export interface iQuestion {
  content: string;
  question_id: string;
  options: iOption[];
}
export interface iOption {
  content: string;
  is_answer: boolean;
  option_id: string;
}

export interface iQuizAttempt {
  user_id: string;
  quiz_id: string;
  attempted_answers: iAttemptedAnswer[];
}

export interface iAttemptedAnswer {
  question_id: string;
  answer: {
    content?: string;
    option_id?: string;
  };
}
