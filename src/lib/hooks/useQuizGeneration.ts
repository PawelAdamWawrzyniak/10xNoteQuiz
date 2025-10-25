import { useState, useCallback, useRef, useEffect } from "react";
import type { QuizGenerationState } from "@/types";

const API_TIMEOUT = 10000; // 10 seconds

export function useQuizGeneration(noteId: string) {
  const [generationState, setGenerationState] = useState<QuizGenerationState>({
    status: "idle",
  });
  const abortControllerRef = useRef<AbortController | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRegeneratingRef = useRef(false);

  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const generateQuiz = useCallback(async () => {
    console.log("[Hook] generateQuiz: Starting quiz generation process");
    cleanup();
    abortControllerRef.current = new AbortController();
    setGenerationState({ status: "loading" });

    timeoutRef.current = setTimeout(() => {
      setGenerationState({ status: "timeout" });
      timeoutRef.current = null;
    }, API_TIMEOUT);

    try {
      console.log("[Hook] generateQuiz: Making API call to generate quiz");
      const response = await fetch(`/api/notes/${noteId}/quizzes`, {
        method: "POST",
        signal: abortControllerRef.current.signal,
      });

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("[Hook] generateQuiz: API error:", response.status, errorData);
        setGenerationState({
          status: "error",
          message: errorData.message || "An unexpected error occurred during quiz generation.",
          code: response.status,
        });
        isRegeneratingRef.current = false;
        return;
      }

      const quiz = await response.json();
      console.log("[Hook] generateQuiz: Quiz generated successfully:", quiz.id);
      setGenerationState({
        status: "success",
        quiz,
        isRegenerated: isRegeneratingRef.current,
      });
      isRegeneratingRef.current = false;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        console.log("Quiz generation fetch aborted.");
        return;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      console.error("[Hook] generateQuiz: Error occurred:", error);
      setGenerationState({
        status: "error",
        message: "A network error occurred. Please check your connection and try again.",
      });
      isRegeneratingRef.current = false;
    }
  }, [noteId, cleanup]);

  const acceptQuiz = useCallback(async (quizId: string) => {
    console.log("[Hook] acceptQuiz called for quizId:", quizId);
    setGenerationState({ status: "accepting" });
    try {
      const response = await fetch(`/api/quizzes/${quizId}/accept`, {
        method: "POST",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message = errorData.message || "Failed to accept the quiz.";
        console.error("[Hook] API error:", message);
        setGenerationState({ status: "error", message, code: response.status });
        throw new Error(message);
      }

      const data = await response.json();
      console.log("[Hook] acceptQuiz successful, setting state to accepted.");
      setGenerationState({ status: "accepted" });
      return data;
    } catch (error) {
      console.error("[Hook] Caught error in acceptQuiz:", error);
      if (!(error instanceof Error && error.message.includes("Failed to accept"))) {
        setGenerationState({
          status: "error",
          message: "A network error occurred while accepting the quiz.",
        });
      }
      throw error;
    }
  }, []);

  const rejectQuiz = useCallback(
    async (quizId: string) => {
      try {
        console.log("[Hook] rejectQuiz: Starting rejection process for quizId:", quizId);

        const response = await fetch(`/api/quizzes/${quizId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const message = errorData.message || "Failed to reject the quiz.";
          setGenerationState({ status: "error", message, code: response.status });
          throw new Error(message);
        }

        const data = await response.json();
        console.log("[Hook] rejectQuiz: Quiz rejected successfully, generating new quiz...");

        // The plan is to generate a new quiz immediately after rejection.
        isRegeneratingRef.current = true;
        await generateQuiz();

        console.log("[Hook] rejectQuiz: New quiz generated successfully");
        return data;
      } catch (error) {
        console.error("[Hook] rejectQuiz: Error occurred:", error);
        if (!(error instanceof Error && error.message.includes("Failed to reject"))) {
          setGenerationState({
            status: "error",
            message: "A network error occurred while rejecting the quiz.",
          });
        }
        throw error; // Re-throw to be caught by toast.promise
      }
    },
    [generateQuiz]
  );

  const resetState = useCallback(() => {
    cleanup();
    setGenerationState({ status: "idle" });
  }, [cleanup]);

  return {
    generationState,
    generateQuiz,
    acceptQuiz,
    rejectQuiz,
    resetState,
  };
}
