import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Question, AnsweredQuestion, QuizState } from './types';

const initialState: QuizState = {
  questions: [],
  error: null,
  currentQuestionId: null,
  answeredQuestions: [],
  isComplete: false,
  numCorrectAnswers: 0,
};

interface QuizStore extends QuizState {
  setQuestions: (questions: Question[]) => void;
  setError: (error: string | null) => void;
  setCurrentQuestion: (questionId: string) => void;
  submitAnswer: (questionId: string, selectedAnswerId: string) => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizStore>()(devtools((set, get) => ({
  ...initialState,

  setQuestions: (questions: Question[]) => {
    if(questions.length === 0) {
      set({ error: 'Questions must be an array' });
      return;
    }
    set({ questions, currentQuestionId: questions[0].id, error: null, numCorrectAnswers: 0, isComplete: false });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  setCurrentQuestion: (id: string) => {
    const { questions } = get();
    if (questions.some(q => q.id === id)) {
      set({ currentQuestionId: id });
    }
    
  },

  submitAnswer: (questionId: string, selectedAnswerId: string) => {
    const { answeredQuestions, questions, setError } = get();

    const question = questions.find(q => q.id === questionId);

    if (!question) {
      setError('Question not found');
      return;
    }

    const answeredQuestion: AnsweredQuestion = {
      questionId,
      selectedAnswerId,
      correctAnswerId: question.correctAnswerId,
    };

    if (answeredQuestion.correctAnswerId === answeredQuestion.selectedAnswerId) {
      set({ numCorrectAnswers: get().numCorrectAnswers + 1 });
    }

    const updatedAnswers = answeredQuestions.filter(
      (aq) => aq.questionId !== questionId
    );
    updatedAnswers.push(answeredQuestion);

    const allAnswered = updatedAnswers.length === questions.length;
    set({
      answeredQuestions: updatedAnswers,
      ...(allAnswered && { isComplete: true }),
    });
  },


  completeQuiz: () => {
    set({ 
      isComplete: true,
    });
  },

  resetQuiz: () => {
    set({ ...initialState });
  },
})));
