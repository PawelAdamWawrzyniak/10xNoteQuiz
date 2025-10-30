import { useState } from "react";
import type { QuizToSolveDto } from "@/types";
import { useQuizSolver } from "@/lib/hooks/useQuizSolver";
import { Button } from "@/components/ui/button";
import { QuizProgress } from "./QuizProgress";
import { QuizQuestion } from "./QuizQuestion";
import { QuizResults } from "./QuizResults";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface QuizSolverProps {
  quiz: QuizToSolveDto;
}

export function QuizSolver({ quiz }: QuizSolverProps) {
  const { state, answerQuestion, goToNextQuestion, goToPreviousQuestion, goToQuestion, canSubmit, submitQuiz } =
    useQuizSolver(quiz);
  const [isSubmitError, setIsSubmitError] = useState(false);

  // If quiz is completed, show results
  if (state.result) {
    return <QuizResults result={state.result} quiz={quiz} />;
  }

  const currentQuestion = quiz.questions[state.currentQuestionIndex];
  const progress = ((state.currentQuestionIndex + 1) / quiz.questions.length) * 100;

  const handleSubmit = async () => {
    if (!canSubmit()) {
      toast.error("Please answer all questions before submitting");
      return;
    }

    try {
      setIsSubmitError(false);
      await submitQuiz();
      toast.success("Quiz submitted successfully!");
    } catch (error) {
      setIsSubmitError(true);
      const errorMessage = error instanceof Error ? error.message : "Failed to submit quiz";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with note title */}
      <div>
        <a href={`/notes/${quiz.note_id}`} className="text-sm text-muted-foreground hover:underline">
          ← Back to Note
        </a>
        <h1 className="text-3xl font-bold mt-2">{quiz.note_title}</h1>
      </div>

      {/* Progress bar */}
      <QuizProgress current={state.currentQuestionIndex + 1} total={quiz.questions.length} progress={progress} />

      {/* Current question */}
      <QuizQuestion
        question={currentQuestion}
        userAnswer={state.userAnswers.get(currentQuestion.id)}
        onAnswer={(answer) => answerQuestion(currentQuestion.id, answer)}
      />

      {/* Navigation */}
      <div className="flex justify-between">
        <Button onClick={goToPreviousQuestion} disabled={state.currentQuestionIndex === 0} variant="outline">
          Previous
        </Button>

        {state.currentQuestionIndex < quiz.questions.length - 1 ? (
          <Button onClick={goToNextQuestion}>Next</Button>
        ) : (
          <Button onClick={handleSubmit} disabled={!canSubmit() || state.isSubmitting}>
            {state.isSubmitting ? "Submitting..." : "Submit Quiz"}
          </Button>
        )}
      </div>

      {/* Question mini-map */}
      <div className="flex gap-2 flex-wrap">
        {quiz.questions.map((q, idx) => (
          <button
            key={q.id}
            onClick={() => goToQuestion(idx)}
            className={cn(
              "w-10 h-10 rounded-md transition-colors",
              state.userAnswers.has(q.id) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
              idx === state.currentQuestionIndex && "ring-2 ring-primary ring-offset-2",
              "hover:opacity-80"
            )}
            aria-label={`Go to question ${idx + 1}`}
          >
            {idx + 1}
          </button>
        ))}
      </div>

      {/* Error message */}
      {isSubmitError && (
        <div className="text-sm text-red-500">An error occurred while submitting. Please try again.</div>
      )}
    </div>
  );
}
