export interface User {
  id: number;
  email: string;
  username: string;
  created_at: string;
}

export interface Question {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  created_at: string;
}

export interface Answer {
  question_id: number;
  selected_answer: string;
}

export interface ExamSubmission {
  answers: Answer[];
}

export interface ExamResult {
  exam_id: number;
  score: number;
  total_questions: number;
  correct_answers: number;
  percentage: number;
  start_time: string;
  end_time: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface LoginForm {
  username: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  username: string;
  password: string;
}
