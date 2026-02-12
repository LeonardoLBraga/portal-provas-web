export interface Exam {
  id: number;
  title: string;
  description: string;
  duration_minutes: number;
  created_at: string;
  user_id: number;
}

export interface QuestionOption {
  id: number;
  text: string;
  is_correct: boolean;
}

export interface Question {
  id: number;
  exam_id: number;
  text: string;
  options: QuestionOption[];
  order: number;
}

export interface ExamWithQuestions extends Exam {
  questions: Question[];
}

export type AttemptStatus = "in_progress" | "submitted";

export interface Attempt {
  id: number;
  exam_id: number;
  user_id: number;
  started_at: string;
  submitted_at: string | null;
  status: AttemptStatus;
}

export interface Answer {
  question_id: number;
  option_id: number;
}

export interface Result {
  attempt_id: number;
  score: number;
  total_questions: number;
  correct_count: number;
}

export interface CreateExamInput {
  title: string;
  description: string;
  duration_minutes: number;
}

export interface CreateQuestionInput {
  text: string;
  options: { text: string; is_correct: boolean }[];
}
