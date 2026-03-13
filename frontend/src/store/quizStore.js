import { create } from 'zustand';

export const useQuizStore = create((set) => ({
  currentSubject: null,
  questions: [],
  answers: {},
  quizStarted: false,
  quizCompleted: false,
  results: null,

  setCurrentSubject: (subject) => set({ currentSubject: subject }),
  setQuestions: (questions) => set({ questions }),
  setAnswer: (questionId, answer) => set((state) => ({
    answers: {
      ...state.answers,
      [questionId]: answer,
    },
  })),
  startQuiz: () => set({ quizStarted: true, quizCompleted: false, answers: {} }),
  completeQuiz: (results) => set({ quizCompleted: true, results }),
  resetQuiz: () => set({
    currentSubject: null,
    questions: [],
    answers: {},
    quizStarted: false,
    quizCompleted: false,
    results: null,
  }),
}));
