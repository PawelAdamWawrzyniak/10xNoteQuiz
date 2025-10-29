import { useState } from "react";
import type { QuizToSolveDto, QuizSolvingState, UserAnswerDto, QuizAttemptResultDto } from "@/types";

interface UseQuizSolverReturn {
  state: QuizSolvingState;
  answerQuestion: (questionId: string, answer: string | null) => void;
  goToNextQuestion: () => void;
  goToPreviousQuestion: () => void;
  goToQuestion: (index: number) => void;
  canSubmit: () => boolean;
  submitQuiz: () => Promise<void>;
}

export function useQuizSolver(quiz: QuizToSolveDto): UseQuizSolverReturn {
  const [state, setState] = useState<QuizSolvingState>({
    currentQuestionIndex: 0,
    userAnswers: new Map(),
    isSubmitting: false,
  });

  const answerQuestion = (questionId: string, answer: string | null) => {
    setState((prev) => {
      const newAnswers = new Map(prev.userAnswers);
      newAnswers.set(questionId, answer);
      return { ...prev, userAnswers: newAnswers };
    });
  };

  const goToNextQuestion = () => {
    setState((prev) => ({
      ...prev,
      currentQuestionIndex: Math.min(prev.currentQuestionIndex + 1, quiz.questions.length - 1),
    }));
  };

  const goToPreviousQuestion = () => {
    setState((prev) => ({
      ...prev,
      currentQuestionIndex: Math.max(prev.currentQuestionIndex - 1, 0),
    }));
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < quiz.questions.length) {
      setState((prev) => ({
        ...prev,
        currentQuestionIndex: index,
      }));
    }
  };

  const canSubmit = (): boolean => {
    // Check if all questions have been answered
    return quiz.questions.every((q) => state.userAnswers.has(q.id));
  };

  const submitQuiz = async (): Promise<void> => {
    if (!canSubmit()) {
      return;
    }

    setState((prev) => ({ ...prev, isSubmitting: true }));

    try {
      // Prepare answers array
      const answers: UserAnswerDto[] = quiz.questions.map((q) => ({
        question_id: q.id,
        answer: state.userAnswers.get(q.id) || null,
      }));

      // Submit to API
      const response = await fetch(`/api/quizzes/${quiz.id}/attempts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit quiz");
      }

      const result: QuizAttemptResultDto = await response.json();

      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        result,
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, isSubmitting: false }));
      throw error;
    }
  };

  return {
    state,
    answerQuestion,
    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestion,
    canSubmit,
    submitQuiz,
  };
}
