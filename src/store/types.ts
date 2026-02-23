// Type definitions for quiz questions and answers

export interface AnswerOption {
  id: string;
  text: string;
}

export interface Question {
  id: string; 
  question: string;
  correctAnswerId: string;
  answers: AnswerOption[]; 
}

export interface AnsweredQuestion {
  questionId: string;
  selectedAnswerId: string | null;
  correctAnswerId: string;
}

export interface QuizState {
  questions: Question[];
  error: string | null;
  
  currentQuestionId: string | null;
  answeredQuestions: AnsweredQuestion[];
  
  isComplete: boolean;
  numCorrectAnswers: number;
}
